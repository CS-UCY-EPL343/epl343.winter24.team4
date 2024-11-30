from flask import session, url_for
from scripts.user.addNewUser import AddNewUserToDb
import bcrypt
from flask import Blueprint, redirect, request, render_template, jsonify
from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *
from datetime import timedelta

from scripts.user.checkUserCredentials import checkUserCredentials

auth = Blueprint('auth', __name__)

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def check_password(entered_password, stored_hash):
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hash.encode('utf-8'))


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('Email')
        password = request.form.get('Password')

        # Check if the user exists
        user = checkUserCredentials(email)

        if user:
            stored_password = user[0].get("Password") if isinstance(user, list) else user.get("Password")

            if stored_password:
                # Check if the password matches
                if check_password(password, stored_password):
                    # Save the user in the session
                    session['user_id'] = user[0].get('id')  # Assuming 'id' is the user identifier
                    return jsonify({"message": "Login successful", "user": user[0]}), 200
                else:
                    return jsonify({"message": "Invalid email or password"}), 401
            else:
                return jsonify({"message": "Password not found for this user"}), 400
        else:
            return jsonify({"message": "User not found"}), 404

    elif request.method == 'GET':
        if 'user_id' in session:  # Check if the user is already logged in
            return redirect(url_for('main.dashboard'))  # Redirect to a dashboard or user page
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
            return jsonify({"error": "All required fields must be filled out."}), 400

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
                return jsonify({"error": "Signup failed. Please try again."}), 500
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    elif request.method == 'GET':
        if 'user_id' in session:
            return redirect(url_for('main.dashboard'))  # Redirect to dashboard if already logged in
        return render_template('/signup.html')


# Add a logout route to clear the session
@auth.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)  # Remove the user from session
    return redirect(url_for('auth.login'))  # Redirect to login page after logout


@auth.route('/enroll', methods=['GET', 'POST']) #TODO:Check for max capacity.
def register():
    if request.method == 'POST':
        try:
            user_id = request.form.get('user_id')
            class_id = request.form.get('class_id')

            success = AddEnrollment(class_id=class_id, user_id=4) #TODO: MAKE IT DYNAMIC WITH THE LOGIN
            if success:
                return jsonify({"message": "Registration successful."}), 201
            else:
                return jsonify({"error": "Failed to register for class."}), 500
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    if request.method == 'GET':
        try:
            # Fetch all classes
            classes_json = SelectAllClasses()
            classes = json.loads(classes_json)

            # Debug: Print all classes
            print("Fetched Classes:", classes)

            # Determine the start and end of the current week (Monday to Sunday)
            today = datetime.today()
            start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
            end_of_week = start_of_week + timedelta(days=6)          # Sunday of the current week

            # Debug: Print the week range
            print("Week Range:", start_of_week.date(), "to", end_of_week.date())

            # Group classes by day within the week
            week_days = [
                {
                    "date": (start_of_week + timedelta(days=i)).strftime("%Y-%m-%d"),
                    "classes": [
                        c for c in classes
                        if datetime.strptime(c['Date'], '%Y-%m-%d').date() == (start_of_week + timedelta(days=i)).date()
                    ]
                }
                for i in range(7)
            ]

            # Debug: Print the week_days structure
            print("Week Days:", week_days)

            return render_template('/enroll.html', week_days=week_days, user_id=1)
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": f"Error loading classes: {str(e)}"}), 500
        
        
@auth.route('/addClass', methods=['GET', 'POST']) #TODO:NEEDS SOME CHECKS 
def add_class():
    if request.method == 'POST':
        try:
            # Handle form submission
            date = request.form.get('date')
            time_start = request.form.get('time_start')
            time_end = request.form.get('time_end')
            max_capacity = request.form.get('max_capacity')
            price = request.form.get('price')
            ex_id = request.form.get('ex_id')  # Get selected exercise type ID

            # Validate required fields
            if not all([date, time_start, time_end, max_capacity, price, ex_id]):
                return jsonify({"error": "All fields are required."}), 400

            # Insert the new class into the database
            success = AddClass(
                date=date,
                time_start=time_start,
                time_end=time_end,
                max_capacity=max_capacity,
                price=price,
                ex_id=ex_id
            )

            if success:
                return jsonify({"message": "Class added successfully."}), 201
            else:
                return jsonify({"error": "Failed to add class."}), 500

        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    elif request.method == 'GET':
        try:
            # Fetch exercise types for the dropdown
            result = GetAllExerciseTypes()
            if not result:
                return jsonify({"error": "Failed to fetch exercise types."}), 500

            exercise_types = json.loads(result)
            # Render the form with exercise types
            return render_template('addClass.html', exercise_types=exercise_types)

        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500 