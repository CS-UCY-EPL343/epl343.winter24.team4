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
        
@admin.route('/admin', methods=['GET', 'POST'])
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
