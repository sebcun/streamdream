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

_To get your Slack stuff, follow the instructions below the setup_

4. Run the app

```
py app.py
```

The website will be available on http://localhost:5000

## Slack Auth Setup

1. Head to https://api.slack.com/apps and login with Slack.
2. Create a new app from Scratch, and pick Hack Club as the workspace
3. On the main page of your app copy the client ID and secret and put in your env.
4. Head to OAuth & Permissions tab, and add your redirect URL (it CANNOT be http eg localhost, if you are wanting to run it locally use a service like ngrok and put that url there)
5. Done!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Issues

If you run into any issues or need support, please open an issue on the repo or reach out to me on slack :)

# License

This project is licensed under the MIT License - see [LICENSE](https://github.com/sebcun/streamdream/blob/main/LICENSE) for details.
