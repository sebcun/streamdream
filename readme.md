# StreamDream YSWS Site

Hey there, this is the site for my potential YSWS [StreamDream](https://streamdream.sebcun.com) for [Hackclub](https://hackclub.com).<br>
**YS:** You create a website, app, script, tool, or something it is related to watching or consuming media.<br>
**WS:** A range of rewards including streaming service subscriptions, speakers, projectors, chromecasts/appletvs/firesticks and more!<br>
**Demo:** https://streamdream.sebcun.com

## Features

- User/Reviewer/Admin roles
- Login with Slack
- Ability to showcase projects that have been approved
- Ability to create new FAQs, Rewards, Ideas, and Rules as an admin
- Ability to manage peoples reviewers status
- As a reviewer, approve and deny projects with reasoning
- Submit projects with automatic Hackatime project population
- Ability to submit orders, as well as an admin mark them as cancelled, pending, or shipped
- Idea generator
- Nice NETFLIX like loading screen :)

## Stack

- Python (Flask), SQLITE3, HTML, CSS, JS

## Setup

1. Clone the repo

```
git clone https://github.com/sebcun/streamdream.git
cd streamdream
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. Setup .env

```
SECRET_KEY=YOUR WEBSITE SECRET KEY
SLACK_CLIENT_ID=YOUR SLACK CLIENT ID
SLACK_CLIENT_SECRET=YOUR SLACK CLIENT SECRET
SLACK_REDIRECT_URI=YOUR DOMAIN + /slack/callback EG: https://streamdream.sebcun.com/slack/callback
ADMIN_SLACK_ID=YOUR SLACK ID EG: U0971C3C44D
```
