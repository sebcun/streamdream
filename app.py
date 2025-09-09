from flask import Flask, jsonify, request, render_template, redirect, session, url_for
from db import getFAQS, initDb, createFAQ, getRewards, createReward, getProjects, getRules, createRule, createProject
import requests, os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
app.secret_key=os.getenv('SECRET_KEY', "YourSecretKey")

SLACK_CLIENT_ID = "2210535565.9480843134949"
SLACK_CLIENT_SECRET = "935a8f5c810af9b8384a187eae76667c"
SLACK_REDIRECT_URI = "https://60afb8458133.ngrok-free.app/slack/callback"

initDb()

@app.route('/')
def index():
    user = session.get("userID")
    if user:
        print("asd")
    return render_template('index.html')

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
    response, status = getProjects()
    return jsonify(response), status

@app.route('/api/hackatime', methods=['GET'])
def getHackatimeAPI():
    user = session.get("userID")
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
    
    idToken = tokenResponse.get("id_token")
    userInfo = requests.get("https://slack.com/api/openid.connect.userInfo", headers={
        "Authorization": f"Bearer {tokenResponse['access_token']}"
    }).json()

    session["userID"] = userInfo["sub"]
    session["email"] = userInfo["email"]
    session["avatar"] = userInfo["picture"]

    return redirect(url_for('index'))

@app.route('/api/me', methods=['GET'])
def meAPI():
    user = session.get("userID")
    if user:
        return jsonify({"message": "Logged in."}), 200
    else:
        return jsonify({"error": "Not logged in."}), 401
    
@app.route('/api/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/api/submitproject', methods=['POST'])
def submitProjectAPI():
    user = session.get("userID")
    if not user:
        return jsonify({"error": "You must be logged in to submit a project."}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data."}), 400
    
    title = data.get("projectName")
    description = data.get("projectDescription")
    hackatimeProject = data.get("hackatimeProject")
    hackatimeTime = data.get("hackatimeTime")  # New field
    demoLink = data.get("demoLink")
    githubLink = data.get("githubLink")
    
    if not all([title, description, hackatimeProject, hackatimeTime, demoLink, githubLink]):
        return jsonify({"error": "All fields are required."}), 400
    
    response, status = createProject(title, description, user, hackatimeProject, hackatimeTime, demoLink, githubLink)
    return jsonify(response), status

@app.route('/api/createrewards', methods=['GET'])
def createrewards():
    response, status = createReward("1 Month Streaming Subscription", "A $20USD grant to spend on your favourite streaming services.", "4 hours", "green")
    response, status = createReward("Stickers", "Enjoy a set of stickers on the house without spending your hours once you hit 5 hours.", "5 hours", "orange")
    response, status = createReward("Amazon Fire TV Stick 4k", "Yeah its what the title says :)", "10 hours", "red")
    response, status = createReward("Roku Streaming Stick 4k", "Yeah its what the title says :)", "10 hours", "purple")
    response, status = createReward("Google TV Streamer", "Yeah its what the title says :)", "20 hours", "blue")
    response, status = createReward("Apple TV 4k WiFi", "Yeah its what the title says :)", "26 hours", "yellow")
    response, status = createReward("JBL Charge 6", "Yeah its what the title says :)", "40 hours")
    return jsonify(response), status

@app.route('/api/createfaq', methods=['GET'])
def createfaq():
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.")
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "red")
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "orange")
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "yellow")
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "green")
    createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "blue")
    response, status = createFAQ("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "purple")  
    return jsonify(response), status

@app.route('/api/createrules', methods=['GET'])
def createrules():
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.")
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "red")
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "orange")
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "yellow")
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "green")
    createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "blue")
    response, status = createRule("Lorem ipsum dolor sit amet, consectetur adipiscing elit?", "Nunc feugiat diam leo. Nullam hendrerit semper dictum. Curabitur tempor semper leo at ultricies. In feugiat nulla sed elementum condimentum. Ut tristique pretium libero, ac efficitur erat mollis vel. Curabitur sed rhoncus turpis. Fusce id tortor magna.", "purple")  
    return jsonify(response), status

if __name__ == "__main__":
    app.run(debug=True)