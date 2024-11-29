from flask import Blueprint, redirect, request, render_template, jsonify
from datetime import datetime, timedelta
from scripts.addNewUser import AddNewUserToDb
from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *
from datetime import timedelta

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return jsonify({"message": "Login successful."}), 200  # Example JSON response
    elif request.method == 'GET':
        return jsonify({"message": "Login page."}), 200  # Example JSON response


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Retrieve form data
        first_name = request.form.get('FName')
        last_name = request.form.get('Lname')
        email = request.form.get('Email')
        password = request.form.get('Password')
        birthday = request.form.get('Birthday')  # Optional field
        phone = request.form.get('Phone')  # Optional field

        # Basic validation
        if not all([first_name, last_name, email, password]):
            return jsonify({"error": "All required fields must be filled out."}), 400

        # Add user to the database
        try:
            success = AddNewUserToDb(
                Fname=first_name,
                Lname=last_name,
                Email=email,
                Password=password,
                Birthday=birthday,
                Phone=phone
            )
            if success:
                return jsonify({"message": "Signup successful."}), 201
            else:
                return jsonify({"error": "Signup failed. Please try again."}), 500
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    if request.method == 'GET':
        return render_template('/signup.html')


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
        
        
@auth.route('/addClass', methods=['GET', 'POST'])
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