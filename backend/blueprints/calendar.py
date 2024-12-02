from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *
from scripts.getClassEnrollments import *
from datetime import timedelta
from flask import Blueprint, request, render_template, jsonify, session, redirect, url_for

calendar = Blueprint('calendar', __name__)

@calendar.route('/calendar', methods=['GET', 'POST'])
def calendarRender():
    if request.method == 'GET':
        if(not 'user_id' in session):
                return(redirect(url_for('auth.login')))
        # Check for query parameters for start and end dates (optional)
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        # If not provided, default to the current week (Monday to Sunday)
        today = datetime.today()

        if not start_date_str or not end_date_str:
            start_of_week = today - timedelta(days=today.weekday())  # Monday
            end_of_week = start_of_week + timedelta(days=6)  # Sunday
        else:
            try:
                start_of_week = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_of_week = datetime.strptime(end_date_str, '%Y-%m-%d')
                return jsonify(classes = selectWeekClasses(start_of_week, end_of_week))
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Fetch or calculate relevant data for the calendar view within the range
        classes = selectWeekClasses(start_of_week, end_of_week)

        return render_template('calendar.html')



@calendar.route('/enroll', methods=['POST'])  
def enroll():
    if 'user_id' not in session:
        return redirect(url_for('main.home'))
    try:
        user_id = session['user_id']
        class_id = request.json.get('class_id') 
        success = AddEnrollment(class_id, user_id)  
        if success:
            return jsonify({"message": "Registration successful."}), 201
        else:
            return jsonify({"error": "Failed to register for class."}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@calendar.route('/addClass', methods=['GET', 'POST'])  # TODO:NEEDS SOME CHECKS
def add_class():
    if(not 'user_id' in session):
        return(redirect(url_for('main.home')))
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
            return render_template('addClass.html', 
                                   exercise_types=exercise_types)

        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
        

@calendar.route('/enrollments',  methods=['GET', 'POST'])
def enrollments():
    return render_template('enrollments.html')


@calendar.route('/isenrolled', methods=['GET'])
def isEnrolled():
    try:
        user_id = session.get('user_id')  
        if not user_id:
            return jsonify({"error": "User not logged in."}), 401

        class_id = request.args.get('class_id')  
        if not class_id:
            return jsonify({"error": "class_id parameter is missing."}), 400

       
        result = getClassEnrollments(class_id)
        if not result:
            return jsonify({"isEnrolled": False})  
        
        is_enrolled = any(enrollment.get("User_ID") == int(user_id) for enrollment in result)

       
        return jsonify({"isEnrolled": is_enrolled})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


