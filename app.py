# Imports
from flask import Flask, jsonify, request, render_template, redirect, session, url_for
from db import getFAQS, initDb, createFAQ, getRewards, createReward, getProjects, getRules, createRule, createProject, updateProjectApproval, createOrUpdateProfile, getProfile, createOrder, getOrders, updateOrderStatus, getProject, getIdeas, createIdea
import requests, os,random
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# ENV
load_dotenv()
SLACK_CLIENT_ID = os.getenv('SLACK_CLIENT_ID')
SLACK_CLIENT_SECRET = os.getenv('SLACK_CLIENT_SECRET')
SLACK_REDIRECT_URI = "https://streamdream.sebcun.com/slack/callback"


# Flask APP
app = Flask(__name__)
app.secret_key=os.getenv('SECRET_KEY', "YourSecretKey")


# Init Database
initDb(os.getenv('ADMIN_SLACK_ID'))

# Index Route
@app.route('/')
def index():
    return render_template('index.html')

# Reviewer Route
@app.route('/reviewer')
def reviewer():
    # Get the current user and check their role to see if they are admin or reviewer
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                return render_template('reviewer.html')
        
    # Not authed, so redirect to homepage
    return redirect(url_for('index'))

# Admin Route
@app.route('/admin')
def admin():
    # Get the current user and check their role to see if they are admin
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 1:
                return render_template('admin.html')
        
    # Not authed, so redirect to homepage.
    return redirect(url_for('index'))

# Profile Route
@app.route('/profile')
def profile():
    # Get the user to make sure someone is actually logged in
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
            return render_template('myprofile.html')
    
    # No one is logged in, so redirect to homepage
    return redirect(url_for('index'))

# API Routes
# Get FAQs
@app.route('/api/faqs', methods=['GET'])
def getFAQsAPI():
    response, status = getFAQS()
    return jsonify(response), status

# Get Rewards
@app.route('/api/rewards', methods=['GET'])
def getRewardsAPI():
    response, status = getRewards()
    return jsonify(response), status

# Get Rules
@app.route('/api/rules', methods=['GET'])
def getRulesAPI():
    response, status = getRules()
    return jsonify(response), status

# Get Ideas
@app.route('/api/ideas', methods=['GET'])
def getIdeasAPI():
    response, status = getIdeas()
    return jsonify(response), status

# Get Projects
@app.route('/api/projects', methods=['GET'])
def getProjectsAPI():

    # Get the user to check if they are admin or reviewer
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                # If they are a reviewer or admin, return ALL projects
                response, status = getProjects()
                return jsonify(response), status
    
    # Not reviewer/admin so only return projects that the authed user CREATED or that status = 1 (meaning its been approved and to show on showcase)
    response, status = getProjects()
    response = [project for project in response if project.get('author') == user or project.get('approved') == 1]
    return jsonify(response), status

# Get Orders
@app.route('/api/orders', methods=['GET'])
def getOrdersAPI():

    # Check if the user is admin
    user = session.get('slackID')
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 1:
            # User is admin so show them ALL orders no matter the creator
            response,status = getOrders()
            return jsonify(response), status
    
    # Not an admin, so only show their own orders
    response, status = getOrders()
    response = [order for order in response if order.get('slack_id') == user]
    return jsonify(response), status

# Get Hackatime Time
@app.route('/api/hackatime', methods=['GET'])
def getHackatimeAPI():
    # Check if the user is authed, if they are get their hackatime!
    user = session.get("slackID")
    if user:
        response = requests.get(f"https://hackatime.hackclub.com/api/v1/users/{user}/stats?limit=1000&features=projects").json()
        return jsonify(response), 200

    # Not authed, but lets make them login (this shouldnt happen unless they go here directly)
    return redirect(url_for('login'))

# Get Me
@app.route('/api/me', methods=['GET'])
def meAPI():
    # Yeah this one is pretty basic so this is all the comments you are getting
    user = session.get("slackID")
    if user:
        response, status = getProfile(slackid=user)
        return response, status
    else:
        return jsonify({"error": "Not logged in."}), 401
    
# Get user
@app.route('/api/user/<userid>', methods=['GET'])
def userAPI(userid):

    # Get requesting user to check if they are reviewr/admin
    user = session.get("slackID")
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 0:
                # They are reviewer/admin so lets return the whole profile
                response, status = getProfile(slackid=userid)
                return response, status
        
    # If not an admin/reviewer, get rid of that email as that is confidential!
    response, status = getProfile(slackid=userid)
    response.pop('email', None)
    return jsonify(response), status

# LOGIN ROUTES
@app.route('/login')
def login():
    # Create slack URL based on env constants
    slackAuthURL=("https://slack.com/openid/connect/authorize"
        f"?response_type=code&client_id={SLACK_CLIENT_ID}"
        f"&scope=openid%20profile%20email"
        f"&redirect_uri={SLACK_REDIRECT_URI}")
    return redirect(slackAuthURL)

# Slack Callback
@app.route('/slack/callback')
def slackCallback():
    # Get the callback code
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No Slack code provided."}), 400
    
    # Get the token response to validate the callback
    tokenResponse = requests.post("https://slack.com/api/openid.connect.token", data={
        "client_id": SLACK_CLIENT_ID,
        "client_secret": SLACK_CLIENT_SECRET,
        "code": code,
        "redirect_uri": SLACK_REDIRECT_URI
    }).json()

    if not tokenResponse.get("ok"):
        return jsonify({"error": "Invalid login code provided from Slack."}), 400
    
    # Get the user info
    userInfo = requests.get("https://slack.com/api/openid.connect.userInfo", headers={
        "Authorization": f"Bearer {tokenResponse['access_token']}"
    }).json()

    # Set the session and create/update profile
    session["slackID"] = userInfo["sub"]

    createOrUpdateProfile(userInfo["sub"], userInfo["email"], userInfo["given_name"], userInfo["picture"])

    return redirect(url_for('index'))

# Logout
@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))

# Submit Project
@app.route('/api/submitproject', methods=['POST'])
def submitProjectAPI():
    # Check if user is logged in
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to submit a project."}), 401
    
    title = request.form.get("projectName")
    description = request.form.get("projectDescription")
    hackatimeProject = request.form.get("hackatimeProject")
    hackatimeTime = request.form.get("hackatimeTime")
    demoLink = request.form.get("demoLink")
    githubLink = request.form.get("githubLink")

    # Handle image
    imageFile = request.files.get("projectImage")
    if not imageFile or imageFile.filename =='':
        return jsonify({"error": "Image is required."}), 400
    
    # Validate the image
    allowedExtensions = {"png", 'jpg', "jpeg", "gif"}
    if '.' not in imageFile.filename or imageFile.filename.rsplit('.', 1)[1].lower() not in allowedExtensions:
        return jsonify({"error": "Invalid image file type."}), 400
    
    # Download the image
    fileName = secure_filename(imageFile.filename)
    imagesDir = os.path.join(app.root_path, 'static', 'images')
    os.makedirs(imagesDir, exist_ok=True)
    imagePath = os.path.join(imagesDir, fileName)
    imageFile.save(imagePath)
    relativePath = f"static/images/{fileName}"


    # Check request data
    if not all([title, description, hackatimeProject, hackatimeTime, demoLink, githubLink]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createProject(title, description, user, hackatimeProject, hackatimeTime, demoLink, githubLink, relativePath)
    return jsonify(response), status

# Submit Order
@app.route('/api/submitorder', methods=['POST'])
def submitOrder():
    # Check if user is logged in
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to submit a project."}), 401
    
    # Get request data
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
    
    # check request data
    if not all([itemid, itemPrice, itemName, fullName, email, phone, address, city, state, zip, country]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createOrder(itemid, itemPrice, itemName, user, fullName, email, phone, address, city, state, zip, country, addressTwo=addressTwo)
    return jsonify(response), status


        
# Reviewer APIs
@app.route('/api/approve/<int:projectid>', methods=['POST'])
def approveProject(projectid):
    # Check if user is logged in
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to approve a project."}), 401
    
    # Check if they are a reviewer
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 0:
            return jsonify({"error": "Not authorized."}), 403
        
    # Check if the project exists
    response, status = getProject(projectid)
    if status != 200:
        return jsonify(response), status
    
    # Get the hours of the project 
    hours = 0
    if 'h' in response['hackatime_time']:
        hoursPart = response['hackatime_time'].split('h')[0].strip()
        try:
            hours = int(hoursPart)
        except:
            hours = 0
    
    # Update profile to new balance
    if hours > 0:
        author = response['author']
        response, status = getProfile(slackid=author)
        if status == 200:
            newBalance = response['balance'] + hours
            createOrUpdateProfile(slackid=author, balance=newBalance)
    
    response, status = updateProjectApproval(projectid, 1, user)
    return jsonify(response), status

@app.route('/api/deny/<int:projectid>', methods=['POST'])
def denyProject(projectid):
    # Check if user is logge din
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to deny a project."}), 401
    
    # Check if the user is a reviewer
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] == 0:
            return jsonify({"error": "Not authorized."}), 403
    
    data = request.get_json()
    denyMessage = data.get("denyMessage", "") if data else ""
    
    response, status = updateProjectApproval(projectid, -1, user, denyMessage)
    return jsonify(response), status

# Admin APIs
# Reviewer API
@app.route('/api/reviewer/<userid>', methods=['POST'])
def reviewerAPI(userid):
    # Get the user to check if logge din
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to edit a users reviewer status."}), 401
    
    # Check if the user is an admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    # Get data
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

# Order API
@app.route('/api/order/<orderid>', methods=['POST'])
def orderAPI(orderid):

    # Get the atuhed user
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to edit an orders status."}), 401
    
    # Check ifu they are admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
        
    # Get data
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    orderStatus = data.get("orderStatus")

    if not orderStatus:
        orderStatus = 0
    
    response, status = updateOrderStatus(orderid, orderStatus)
    return jsonify(response), status

# Create FAQ Api
@app.route('/api/createfaq', methods=['POST'])
def createFAQAPI():

    # Get logged in user
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create an FAQ."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    # Check if they are admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    # Get data
    title = data.get("faqTitle")
    description = data.get("faqDescription")
    
    if not all([title, description]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createFAQ(title, description, color)  
    return jsonify(response), status

# Create rule api
@app.route('/api/createrule', methods=['POST'])
def createRuleAPI():
    # Get logged in user
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create a rule."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    # Check if they are admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    # Get data
    title = data.get("ruleTitle")
    description = data.get("ruleDescription")
    
    if not all([title, description]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createRule(title, description, color)  
    return jsonify(response), status

# Create reward api
@app.route('/api/createreward', methods=['POST'])
def createRewardAPI():

    # Get logged in user
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create a reward."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    # check if they are admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    
    # Get that data
    title = data.get("rewardTitle")
    description = data.get("rewardDescription")
    time = data.get("rewardTime")
    
    if not all([title, description, time]):
        return jsonify({"error": "All fields are required."}), 400
    
    colors = ["red", "orange", "yellow", "green", "blue", "purple", ""]
    color = random.choice(colors)
    
    response, status = createReward(title, description, time, color)
    return jsonify(response), status

# Create idea api
@app.route('/api/createidea', methods=['POST'])
def createIdeaAPI():

    # Check if they are logged in
    user = session.get("slackID")
    if not user:
        return jsonify({"error": "You must be logged in to create an idea."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    # Check if they are admin
    response, status = getProfile(slackid=user)
    if status == 200:
        if response['role'] != 1:
            return jsonify({"error": "Not authorized."}), 403
    

    # Get data
    title = data.get("ideaTitle")
    description = data.get("ideaDescription")
    
    if not all([title, description]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createIdea(title, description)
    return jsonify(response), status


    
if __name__ == "__main__":
    app.run(debug=True)