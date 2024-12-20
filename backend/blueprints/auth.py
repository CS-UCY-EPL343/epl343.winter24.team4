from flask import Blueprint, redirect, request, render_template, jsonify, session, url_for
from scripts.user.addNewUser import AddNewUserToDb
import bcrypt
import re

from scripts.user.changeUserData import changePassword, getInfoFromUserId, changeEmail
from scripts.user.checkUserCredentials import checkUserCredentials

auth = Blueprint('auth', __name__)

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def check_password(entered_password, stored_hash):
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hash.encode('utf-8'))

def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r'[A-Z]', password):
        return "Password must contain at least one uppercase letter."
    if not re.search(r'[a-z]', password):
        return "Password must contain at least one lowercase letter."
    if not re.search(r'[0-9]', password):
        return "Password must contain at least one number."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return "Password must contain at least one special character."
    return None

def is_admin():
    if('isAdmin' not in session or not session.get('isAdmin')):
        return False
    else: 
        return True
        
        
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if the user exists
        user = checkUserCredentials(email)

        if user:
            stored_password = user[0].get("Password") if isinstance(user, list) else user.get("Password")

            if stored_password:
                # Check if the password matches
                if check_password(password, stored_password):
                    # Save the user in the session
                    session['user_id'] = user[0].get('User_ID')  # Assuming 'id' is the user identifier
                    session['isAdmin'] = user[0].get('isAdmin') 
                    return redirect(url_for('main.home'))
                else:
                    return render_template('/login.html', error="Invalid email or password."), 401
            else:
                return render_template('/login.html', error="Password not found for this user."), 400
        else:
            return render_template('/login.html', error="User not found."), 404

    elif request.method == 'GET':
        if 'user_id' in session:  # Check if the user is already logged in
            return redirect(url_for('main.home'))  # Redirect to a dashboard or user page
        return render_template('/login.html')


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first_name = request.form.get('FName')
        last_name = request.form.get('LName')
        email = request.form.get('Email')
        password = request.form.get('Password')
        birthday = request.form.get('Birthday')  # Optional field
        phone = request.form.get('Phone')  # Optional field

        if not all([first_name, last_name, email, password]):
            return render_template('/signup.html', error="All required fields must be filled out."), 400

        password_error = validate_password(password)
        if password_error:
            return render_template('/signup.html', error=password_error), 400

        try:
            success = AddNewUserToDb(
                Fname=first_name,
                Lname=last_name,
                Email=email,
                Password=hash_password(password),
                Birthday=birthday,
                Phone=phone
            )
            if success:
                return redirect(url_for('auth.login'))  # Redirect to login after successful signup
            else:
                return render_template('/signup.html', error="Signup failed. Please try again."), 500
        except Exception as e:
            return render_template('/signup.html', error=f"An error occurred: {str(e)}"), 500

    elif request.method == 'GET':
        if 'user_id' in session:
            return redirect(url_for('main.home'))  # Redirect to dashboard if already logged in
        return render_template('/signup.html')



# Add a logout route to clear the session
@auth.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('auth.login'))  # Redirect to login page after logout


@auth.route('/profile',methods=['GET', 'POST'])
def profile():
    if not 'user_id' in session:
        return redirect(url_for('auth.login'))
    if request.method == 'GET':
        return render_template("profile.html")
    if request.method == 'POST':
        old_password = request.form.get('old-password')
        new_password = request.form.get('new-password')
        new_email = request.form.get('new-email')
        if new_password:
            user = getInfoFromUserId(session['user_id'])
            if user:
                stored_password = user[0].get("Password") if isinstance(user, list) else user.get("Password")
                if stored_password:
                    # Check if the password matches
                    if check_password(old_password, stored_password):
                        changePassword(hash_password(new_password), session['user_id'])
                        return render_template("profile.html", passworderror="Succesfully changed password.")
                    else:
                        return render_template('profile.html', passworderror="Wrong old password"), 401
                else:
                    return render_template('profile.html', passworderror="Password not found for this user."), 400
            else:
                return render_template('profile.html', passworderror="User not found."), 404
        elif new_email:
            user = getInfoFromUserId(session['user_id'])
            if user:
                stored_password = user[0].get("Password") if isinstance(user, list) else user.get("Password")
                if stored_password:
                    # Check if the password matches
                    if check_password(old_password, stored_password):
                        changeEmail(new_email, session['user_id'])
                        return render_template('profile.html', emailerror="Succesfully changed Email.")
                    else:
                        return render_template('profile.html', emailerror="Wrong old password")
                else:
                    return render_template('profile.html', emailerror="Password not found for this user.")
            else:
                return render_template('profile.html', emailerror="User not found.")
            
    return render_template("profile.html", error="Invalid request method.")


@auth.route('/getProfile',methods=['GET'])
def getprofile():
    user = getInfoFromUserId(session['user_id'])
    if user:
        return jsonify(user)