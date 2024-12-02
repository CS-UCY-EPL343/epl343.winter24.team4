from flask import session, url_for
from scripts.user.addNewUser import AddNewUserToDb
from .auth import is_admin
from flask import Blueprint, redirect, request, render_template
from datetime import timedelta
from flask import Blueprint, request, render_template, jsonify, session, redirect, url_for
from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *
from datetime import timedelta


admin = Blueprint('admin', __name__)

@admin.route('/admin/class', methods=['GET', 'POST'])
def admin_class():
    if request.method == 'GET':
        if(is_admin()):
            return render_template("admin-class.html")
        else:
            return redirect(url_for('main.home'))
        

@admin.route('/admin/admin-payments', methods=['GET', 'POST'])
def admin_payments():
    if request.method == 'GET':
        if(is_admin()):
            return render_template("admin-payments.html")
        else:
            return redirect(url_for('main.home'))
        
@admin.route('/admin/class', methods=['GET', 'POST'])
def calendarRender():
    if request.method == 'GET':
        if(not 'user_id' in session):
                return(redirect(url_for('main.home')))
        # Check for query parameters for start and end dates (optional)
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        # If not provided, default to the current week (Monday to Sunday)
        today = datetime.today()

        if not start_date_str or not end_date_str:
            start_of_week = today - timedelta(days=today.weekday())  # Monday
            end_of_week = start_of_week + timedelta(days=6)  # Sunday
            try:
                return jsonify(classes = selectWeekClasses(start_of_week, end_of_week))
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
        else:
            try:
                start_of_week = datetime.strptime(start_date_str, '%Y-%m-%d')
                end_of_week = datetime.strptime(end_date_str, '%Y-%m-%d')
                return jsonify(classes = selectWeekClasses(start_of_week, end_of_week))
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
            
@admin.route('/api/admin/class/insertClass', methods=['POST'])
def InsertClass():
    try:
        # Check if the method is POST
        if request.method == 'POST':
            # Get JSON data from the POST request
            data = request.get_json()

            # Check if data is provided
            if not data:
                return jsonify({"error": "No data provided in the request body."}), 400

            # Example: Validate required fields
            required_fields = ["date","time_start","time_end","max_capacity","price","ex_id"]
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

            #call procedure
            if(AddClass( date=data["date"],time_start=data["time_start"],time_end=data["time_end"], max_capacity=data["max_capacity"], price=data["price"],ex_id=data["ex_id"])):
               # Return a success response
                return jsonify({"status": "success", "message": "Class inserted successfully.", "data": data}), 201

        # Handle non-POST methods
        else:
            return jsonify({"error": "Only POST requests are allowed."}), 405
    except Exception as e:
        # Catch any unexpected errors and return a 500 error response
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500