import os, sqlite3

def getDbConnection():
    dbPath = os.environ.get('DB_PATH')
    
    # Fallback to local database for testing
    if not dbPath:
        dbPath = 'database.db'
    
    # Ensure folder exists
    if os.path.dirname(dbPath):
        os.makedirs(os.path.dirname(dbPath), exist_ok=True)
    
    conn = sqlite3.connect(dbPath)
    conn.row_factory = sqlite3.Row
    return conn

def initDb(adminid):
    conn = getDbConnection()

    # FAQs table
    conn.execute('''CREATE TABLE IF NOT EXISTS faqs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        question TEXT NOT NULL,
                        answer TEXT NOT NULL,
                        color TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

    # Rewards table
    conn.execute('''CREATE TABLE IF NOT EXISTS rewards (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        reward TEXT NOT NULL,
                        description TEXT NOT NULL,
                        price INTEGER NOT NULL DEFAULT 0,
                        color TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

    # Rules table
    conn.execute('''CREATE TABLE IF NOT EXISTS rules (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        rule TEXT NOT NULL,
                        description TEXT NOT NULL,
                        color TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

    # Projects table
    conn.execute('''CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        description TEXT NOT NULL,
                        author TEXT NOT NULL DEFAULT '[]',
                        hackatime_project TEXT NOT NULL,
                        hackatime_time TEXT NOT NULL, 
                        demo_link TEXT NOT NULL,
                        github_link TEXT NOT NULL,
                        image TEXT NOT NULL,
                        approved INTEGER NOT NULL DEFAULT 0,
                        deny_message TEXT,
                        reviewer TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')
    
    # Profiles table
    conn.execute('''CREATE TABLE IF NOT EXISTS profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slack_id TEXT NOT NULL UNIQUE,
                    email TEXT,
                    name TEXT,
                    avatar TEXT,
                    role INTEGER NOT NULL DEFAULT 0,
                    balance INTEGER NOT NULL DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')
    
    # Orders table
    conn.execute('''CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER NOT NULL,
                    item_name TEXT NOT NULL,
                    slack_id TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    address TEXT NOT NULL,
                    address_two TEXT,
                    city TEXT NOT NULL,
                    state TEXT NOT NULL,
                    zip TEXT NOT NULL,
                    country TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')

    try:
        conn.execute('ALTER TABLE profiles ADD COLUMN name TEXT')
        conn.execute('ALTER TABLE projects ADD COLUMN reviewer TEXT')
        conn.execute('ALTER TABLE projects ADD COLUMN deny_message TEXT')
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()
    createOrUpdateProfile(slackid=adminid, role=1)

def getFAQS():
    conn = getDbConnection()
    faqs = conn.execute('SELECT id, question, answer, color, created_at FROM faqs').fetchall()
    conn.close()
    return [{'id': row[0], 'question': row[1], 'answer': row[2], 'color': row[3], 'created_at': row[4]} for row in faqs], 200

def getRewards():
    conn = getDbConnection()
    rewards = conn.execute('SELECT id, reward, description, price, color, created_at FROM rewards').fetchall()
    conn.close()
    return [{'id': row[0], 'reward': row[1], 'description': row[2], 'price': row[3],'color': row[4], 'created_at': row[5]} for row in rewards], 200

def getRules():
    conn = getDbConnection()
    rewards = conn.execute('SELECT id, rule, description, color, created_at FROM rules').fetchall()
    conn.close()
    return [{'id': row[0], 'rule': row[1], 'description': row[2], 'color': row[3], 'created_at': row[4]} for row in rewards], 200

def getProjects():
    conn = getDbConnection()
    projects = conn.execute('SELECT id, title, description, author, hackatime_project, hackatime_time, demo_link, github_link, image, approved, deny_message, reviewer, created_at FROM projects').fetchall()
    conn.close()
    return [{'id': row[0], 'title': row[1], 'description': row[2], 'author': row[3], 'hackatime_project': row[4], 'hackatime_time': row[5], 'demo_link': row[6], 'github_link': row[7], 'image': row[8], 'approved': row[9], 'deny_message': row[10], 'reviewer': row[11], 'created_at': row[12]} for row in projects], 200
    
def createFAQ(question, answer, color=''):
    if not question or not answer:
        return {"error": "Question and answer are required."}, 400
    
    conn = getDbConnection()
    cursor = conn.execute('INSERT INTO faqs (question, answer, color) VALUES (?, ?, ?)', (question, answer, color))
    faqid = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"message": "FAQ created successfully.", "faqid": faqid}, 201
    
def createReward(reward, description, price, color=''):
    if not reward or not description or not price:
        return {"error": "Reward, description, and price are required."}, 400
    
    conn = getDbConnection()
    cursor = conn.execute('INSERT INTO rewards (reward, description, price, color) VALUES (?, ?, ?, ?)', (reward, description, price, color))
    rewardid = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"message": "Reward created successfully.", "rewardid": rewardid}, 201
    
def createRule(rule, description, color=''):
    if not rule or not description:
        return {"error": "Rule and description are required."}, 400
    
    conn = getDbConnection()
    cursor = conn.execute('INSERT INTO rules (rule, description, color) VALUES (?, ?, ?)', (rule, description, color))
    ruleid = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"message": "Rule created successfully.", "ruleid": ruleid}, 201

def createProject(title, description, author, hackatimeProject, hackatimeTime, demoLink, githubLink, image=''):
    if not title or not description or not author or not hackatimeProject or not hackatimeTime or not demoLink or not githubLink:
        return {"error": "All fields are required."}, 400
    
    conn = getDbConnection()
    cursor = conn.execute('INSERT INTO projects (title, description, author, hackatime_project, hackatime_time, demo_link, github_link, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                          (title, description, author, hackatimeProject, hackatimeTime, demoLink, githubLink, image))
    projectid = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"message": "Project submitted successfully.", "projectid": projectid}, 201

def createOrder(itemid, itemPrice, itemName, slackid, fullName, email, phone, address, city, state, zip, country, addressTwo=''):
    if not itemid or not itemName or not slackid or not fullName or not email or not phone or not address or not city or not state or not zip or not country:
        return {"error": "All fields are required."}, 400
    
    response, status = getProfile(slackid=slackid)
    if response.get("balance") < itemPrice:
        return {"error": "You do not have enough hours for this."}, 400
    
    newBalance = response.get('balance') - itemPrice
    
    createOrUpdateProfile(slackid, balance=newBalance)
    
    conn = getDbConnection()
    cursor = conn.execute('INSERT INTO orders (item_id, item_name, slack_id, full_name, email, phone, address, address_two, city, state, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                          (itemid, itemName, slackid, fullName, email, phone, address, addressTwo, city, state, zip, country ))
    conn.commit()
    conn.close()

    return {"message": "Order submitted successfully."}, 200

def updateProjectApproval(projectid, approved, reviewer, denyMessage=None):
    if not projectid or approved not in [0, 1, -1] or not reviewer:
        return {"error": "Invalid project ID, approval status, or reviewer not supplied."}, 400
    
    conn = getDbConnection()
    if approved == -1 and denyMessage:
        cursor = conn.execute('UPDATE projects SET approved = ?, deny_message = ?, reviewer = ? where id = ?', (approved, denyMessage, reviewer, projectid))
    else:
        cursor = conn.execute('UPDATE projects SET approved = ?, reviewer = ? where id = ?', (approved, reviewer,  projectid))
    if cursor.rowcount == 0:
        conn.close()
        return {"error": "Project not found."}, 404
    
    conn.commit()
    conn.close()
    return {"message": "Project approval update."}, 200

def createOrUpdateProfile(slackid, email=None, name=None, avatar=None, role=None, balance=None):
    conn = getDbConnection()

    existing = conn.execute('SELECT id FROM profiles WHERE slack_id = ?', (slackid,)).fetchone()

    if existing:
        set_parts = []
        params = []
        if email is not None:
            set_parts.append('email = ?')
            params.append(email)
        if name is not None:
            set_parts.append('name = ?')
            params.append(name)
        if avatar is not None:
            set_parts.append('avatar = ?')
            params.append(avatar)
        if role is not None:
            set_parts.append('role = ?')
            params.append(role)
        if balance is not None:
            set_parts.append('balance = ?')
            params.append(balance)
        
        if set_parts:
            set_parts.append('updated_at = CURRENT_TIMESTAMP')
            query = f"UPDATE profiles SET {', '.join(set_parts)} WHERE slack_id = ?"
            params.append(slackid)
            conn.execute(query, tuple(params))  
    else:
        cursor = conn.execute('INSERT INTO profiles (slack_id, email, name, avatar) VALUES (?, ?, ?, ?)', 
                          (slackid, email, name, avatar))

    conn.commit()
    conn.close()
    return {"message": "Profile updated successfully."}, 200

def getProfile(userid=None, slackid=None):
    if not userid and not slackid:
        return {"error": "UserID or SlackID required."}, 400
    
    conn = getDbConnection()
    if userid:
        profile = conn.execute('SELECT id, slack_id, email, name, avatar, role, balance, created_at, updated_at FROM profiles WHERE id = ?', (userid,)).fetchone()
    else:
        profile = conn.execute('SELECT id, slack_id, email, name, avatar, role, balance, created_at, updated_at FROM profiles WHERE slack_id = ?', (slackid,)).fetchone()
    conn.close()

    if profile:
        return {'userid': profile[0], 'slack_id': profile[1], 'email': profile[2], 'name': profile[3], 'avatar': profile[4], 'role': profile[5], 'balance': profile[6], 'created_at': profile[7], 'updated_at': profile[8]}, 200
    
    return {"error": "User not found."}, 404