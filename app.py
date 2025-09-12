from flask import Flask, jsonify, request, render_template, redirect, session, url_for
from db import getFAQS, initDb, createFAQ, getRewards, createReward, getProjects, getRules, createRule, createProject, updateProjectApproval, createOrUpdateProfile, getProfile, createOrder
import requests, os,random
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
app.secret_key=os.getenv('SECRET_KEY', "YourSecretKey")

SLACK_CLIENT_ID = os.getenv('SLACK_CLIENT_ID')
SLACK_CLIENT_SECRET = os.getenv('SLACK_CLIENT_SECRET')
SLACK_REDIRECT_URI = "https://amazing-earwig-reliably.ngrok-free.app/slack/callback"

initDb(os.getenv('ADMIN_SLACK_ID'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/reviewer')
def reviewer():
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                return render_template('reviewer.html')
    return redirect(url_for('index'))

@app.route('/profile')
def profile():
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
            return render_template('myprofile.html')
    return redirect(url_for('index'))

@app.route('/api/faqs', methods=['GET'])
def getFAQsAPI():
    response, status = getFAQS()
    return jsonify(response), status

@app.route('/api/rewards', methods=['GET'])
def getRewardsAPI():
    response, status = getRewards()
    return jsonify(response), status

@app.route('/api/rules', methods=['GET'])
def getRulesAPI():
    response, status = getRules()
    return jsonify(response), status

@app.route('/api/projects', methods=['GET'])
def getProjectsAPI():

    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                response, status = getProjects()
                return jsonify(response), status
    
    response, status = getProjects()
    response = [project for project in response if project.get('author') == user or project.get('approved') == 1]
    return jsonify(response), status

@app.route('/api/hackatime', methods=['GET'])
def getHackatimeAPI():
    user = session.get("slackID")
    if user:
        response = requests.get(f"https://hackatime.hackclub.com/api/v1/users/{user}/stats?limit=1000&features=projects").json()
        return jsonify(response), 200

    return redirect(url_for('login'))

@app.route('/login')
def login():
    slackAuthURL=("https://slack.com/openid/connect/authorize"
        f"?response_type=code&client_id={SLACK_CLIENT_ID}"
        f"&scope=openid%20profile%20email"
        f"&redirect_uri={SLACK_REDIRECT_URI}")
    return redirect(slackAuthURL)

@app.route('/slack/callback')
def slackCallback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No Slack code provided."}), 400
    
    tokenResponse = requests.post("https://slack.com/api/openid.connect.token", data={
        "client_id": SLACK_CLIENT_ID,
        "client_secret": SLACK_CLIENT_SECRET,
        "code": code,
        "redirect_uri": SLACK_REDIRECT_URI
    }).json()

    if not tokenResponse.get("ok"):
        return jsonify({"error": "Invalid login code provided from Slack."}), 400
    
    userInfo = requests.get("https://slack.com/api/openid.connect.userInfo", headers={
        "Authorization": f"Bearer {tokenResponse['access_token']}"
    }).json()

    session["slackID"] = userInfo["sub"]

    createOrUpdateProfile(userInfo["sub"], userInfo["email"], userInfo["given_name"], userInfo["picture"])

    return redirect(url_for('index'))

@app.route('/api/me', methods=['GET'])
def meAPI():
    user = session.get("slackID")
    if user:
        response, status = getProfile(slackid=user)
        return response, status
    else:
        return jsonify({"error": "Not logged in."}), 401
    
@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/api/submitproject', methods=['POST'])
def submitProjectAPI():
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to submit a project."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    title = data.get("projectName")
    description = data.get("projectDescription")
    hackatimeProject = data.get("hackatimeProject")
    hackatimeTime = data.get("hackatimeTime")
    demoLink = data.get("demoLink")
    githubLink = data.get("githubLink")
    
    if not all([title, description, hackatimeProject, hackatimeTime, demoLink, githubLink]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createProject(title, description, user, hackatimeProject, hackatimeTime, demoLink, githubLink)
    return jsonify(response), status



@app.route('/api/user/<userid>', methods=['GET'])
def userAPI(userid):

    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                response, status = getProfile(slackid=userid)
                return response, status
        
    response, status = getProfile(slackid=userid)
    response.pop('email', None)
    return jsonify(response), status
        
    
@app.route('/api/approve/<int:projectid>', methods=['POST'])
def approveProject(projectid):
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to approve a project."}), 401
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 0:
            return jsonify({"error": "Not authorized."}), 403
    
    response, status = updateProjectApproval(projectid, 1, user)
    return jsonify(response), status

@app.route('/api/deny/<int:projectid>', methods=['POST'])
def denyProject(projectid):
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to deny a project."}), 401
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 0:
            return jsonify({"error": "Not authorized."}), 403
    
    data = request.get_json()
    denyMessage = data.get("denyMessage", "") if data else ""
    
    response, status = updateProjectApproval(projectid, -1, user, denyMessage)
    return jsonify(response), status

@app.route('/api/reviewer/<userid>', methods=['POST'])
def reviewerAPI(userid):

    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to edit a users reviewer status."}), 401
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    reviewerStatus = data.get("reviewerStatus")

    if not reviewerStatus:
        reviewerStatus = 0

    response, status = getProfile(slackid=userid)
    if status != 200:
        return jsonify(response), status

    
    response, status = createOrUpdateProfile(slackid=userid, role=reviewerStatus)
    return jsonify(response), status

@app.route('/api/createfaq', methods=['POST'])
def createFAQAPI():
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create an FAQ."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    title = data.get("faqTitle")
    description = data.get("faqDescription")
    
    if not all([title, description]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createFAQ(title, description, color)  
    return jsonify(response), status

@app.route('/api/createrule', methods=['POST'])
def createRuleAPI():
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create a rule."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    title = data.get("ruleTitle")
    description = data.get("ruleDescription")
    
    if not all([title, description]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createRule(title, description, color)  
    return jsonify(response), status


@app.route('/api/createreward', methods=['POST'])
def createRewardAPI():
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create a reward."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    title = data.get("rewardTitle")
    description = data.get("rewardDescription")
    time = data.get("rewardTime")
    
    if not all([title, description, time]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createReward(title, description, time, color)
    return jsonify(response), status


@app.route('/api/submitorder', methods=['POST'])
def submitOrder():

    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to submit a project."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    itemid = data.get("itemID")
    itemPrice = data.get("itemPrice")
    itemName = data.get("itemName")
    fullName = data.get("fullName")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")
    city = data.get("city")
    state = data.get("state")
    zip = data.get("zip")
    country = data.get("country")
    addressTwo = data.get("addressLine2")
    
    if not all([itemid, itemPrice, itemName, fullName, email, phone, address, city, state, zip, country]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createOrder(itemid, itemPrice, itemName, user, fullName, email, phone, address, city, state, zip, country, addressTwo=addressTwo)
    return jsonify(response), status
    
if __name__ == "__main__":
    app.run(debug=True)