from flask import Flask, request, render_template_string, session, redirect, url_for
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

users = {
    "user1": {"password": "pass1", "balance": 5000},
    "user2": {"password": "pass2", "balance": 3000}
}

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template_string(LOGIN_TEMPLATE)

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    if username in users and users[username]["password"] == password:
        session['username'] = username
        return redirect(url_for('dashboard'))
    
    return render_template_string(LOGIN_TEMPLATE, error="Invalid username or password")

@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('home'))
    
    username = session['username']
    return render_template_string(DASHBOARD_TEMPLATE, 
                                 username=username, 
                                 balance=users[username]["balance"])

@app.route('/deposit', methods=['POST'])
def deposit():
    if 'username' not in session:
        return redirect(url_for('home'))
    
    username = session['username']
    try:
        amount = float(request.form['amount'])
        if amount <= 0:
            return render_template_string(DASHBOARD_TEMPLATE, 
                                         username=username, 
                                         balance=users[username]["balance"],
                                         message="Amount must be positive")
        
        users[username]["balance"] += amount
        return render_template_string(DASHBOARD_TEMPLATE, 
                                     username=username, 
                                     balance=users[username]["balance"],
                                     message=f"Successfully deposited ₹{amount:.2f}")
    except ValueError:
        return render_template_string(DASHBOARD_TEMPLATE, 
                                     username=username, 
                                     balance=users[username]["balance"],
                                     message="Please enter a valid amount")

@app.route('/withdraw', methods=['POST'])
def withdraw():
    if 'username' not in session:
        return redirect(url_for('home'))
    
    username = session['username']
    try:
        amount = float(request.form['amount'])
        if amount <= 0:
            return render_template_string(DASHBOARD_TEMPLATE, 
                                         username=username, 
                                         balance=users[username]["balance"],
                                         message="Amount must be positive")
        
        if amount > users[username]["balance"]:
            return render_template_string(DASHBOARD_TEMPLATE, 
                                         username=username, 
                                         balance=users[username]["balance"],
                                         message="Insufficient balance")
        
        users[username]["balance"] -= amount
        return render_template_string(DASHBOARD_TEMPLATE, 
                                     username=username, 
                                     balance=users[username]["balance"],
                                     message=f"Successfully withdrew ₹{amount:.2f}")
    except ValueError:
        return render_template_string(DASHBOARD_TEMPLATE, 
                                     username=username, 
                                     balance=users[username]["balance"],
                                     message="Please enter a valid amount")

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
  <title>Banking Login</title>
  <style>
    body { font-family: Arial; background: #f0f8ff; max-width: 500px; margin: auto; padding: 20px; }
    .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px #ccc; }
    input, button { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
    .error { color: red; text-align: center; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Banking Login</h2>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    {% if error %}<div class="error">{{ error }}</div>{% endif %}
    <div>Try: user1/pass1 or user2/pass2</div>
  </div>
</body>
</html>
'''

DASHBOARD_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
  <title>Online Banking</title>
  <style>
    body { font-family: Arial; background: #f0f8ff; max-width: 600px; margin: auto; padding: 20px; }
    .box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px #ccc; margin-bottom: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .balance { font-size: 24px; font-weight: bold; color: #007bff; }
    .message { padding: 10px; text-align: center; font-weight: bold; border-radius: 4px; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .action-box { background: #f8f9fa; padding: 15px; border-radius: 8px; }
    .logout { text-align: right; }
    input, button { width: 100%; padding: 8px; margin: 5px 0; box-sizing: border-box; }
  </style>
</head>
<body>
  <div class="box">
    <div class="header">
      <h2>Welcome, {{ username }}</h2>
      <div class="balance">₹{{ balance }}</div>
    </div>
    <div class="logout"><a href="/logout">Logout</a></div>
    
    {% if message %}
      <div class="message">{{ message }}</div>
    {% endif %}
    
    <div class="actions">
      <div class="action-box">
        <h3>Deposit</h3>
        <form method="POST" action="/deposit">
          <input type="number" name="amount" step="0.01" min="0.01" placeholder="Amount" required>
          <button type="submit">Deposit</button>
        </form>
      </div>
      
      <div class="action-box">
        <h3>Withdraw</h3>
        <form method="POST" action="/withdraw">
          <input type="number" name="amount" step="0.01" min="0.01" placeholder="Amount" required>
          <button type="submit">Withdraw</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
'''

if __name__ == '__main__':
    app.run(debug=True)