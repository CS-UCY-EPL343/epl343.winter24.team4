from flask import Blueprint, redirect, request, render_template, jsonify
from datetime import datetime, timedelta
from scripts.addNewUser import AddNewUserToDb
from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *

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
        return jsonify({"message": "Signup page."}), 200  # Example JSON response


@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        try:
            # Handle class registration form submission
            user_id = request.form.get('user_id')  # Example: hidden field or session user ID
            class_id = request.form.get('class_id')  # Selected class ID

            success = AddEnrollment(class_id=class_id, user_id=user_id)
            if success:
                return jsonify({"message": "Registration successful."}), 201
            else:
                return jsonify({"error": "Failed to register for class."}), 500
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    if request.method == 'GET':
        try:
            # Fetch all classes for the current week
            classes_json = SelectAllClasses()  # Fetch all classes
            classes = json.loads(classes_json)  # Parse JSON into Python object

            # Filter for classes in the current week
            today = datetime.today()
            end_of_week = today + timedelta(days=7)
            weekly_classes = [
                c for c in classes
                if today.date() <= datetime.strptime(c['Date'], '%Y-%m-%d').date() <= end_of_week.date()
            ]

            return jsonify({"weekly_classes": weekly_classes}), 200
        except Exception as e:
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
            return jsonify({"exercise_types": exercise_types}), 200

        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
