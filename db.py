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

def initDb():
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
                        price TEXT NOT NULL,
                        color TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

    # Rewards table
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
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')

    conn.commit()
    conn.close()

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
    projects = conn.execute('SELECT id, title, description, author, hackatime_project, hackatime_time, demo_link, github_link, image, approved, created_at FROM projects').fetchall()
    conn.close()
    return [{'id': row[0], 'title': row[1], 'description': row[2], 'author': row[3], 'hackatime_project': row[4], 'hackatime_time': row[5], 'demo_link': row[6], 'github_link': row[7], 'image': row[8], 'approved': row[9], 'created_at': row[10]} for row in projects], 200
    
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
    projectId = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"message": "Project submitted successfully.", "projectId": projectId}, 201