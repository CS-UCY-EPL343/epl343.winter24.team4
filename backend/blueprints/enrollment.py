from scripts.addNewEnrollment import AddEnrollment
from scripts.addNewClass import AddClass
from scripts.selectClass import *
from scripts.selectExerciseType import *
from scripts.selectEnrollments import *
from scripts.deleteEnrollment import *
from scripts.selectExerciseType import *
from datetime import timedelta
from flask import Blueprint, request, render_template, jsonify, session, redirect, url_for


enrollment = Blueprint('enrollment', __name__)

@enrollment.route('/enrollments',  methods=['GET', 'POST'])
def enrollments():
    return render_template('enrollments.html')

@enrollment.route('/api/enrollments',  methods=['GET'])
def getenrollments():
    try:
        # Check if the user is logged in by verifying session data
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401

        # Get the user's enrollments
        user_id = session['user_id']
        result = SelectUserEnrollments(user_id)

        # Check if the result is empty or an error message
        if not result:
            return jsonify({"message": "No enrollments found for the user."}), 404

        if isinstance(result, str) and "error" in result.lower():
            return jsonify({"error": result}), 500  # Custom error from SelectUserEnrollments

        # Successfully retrieved enrollments
        return jsonify({"enrollments": result}), 200

    except KeyError as e:
        # Handle missing session data
        return jsonify({"error": f"Missing session key: {str(e)}"}), 400

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    
@enrollment.route('/api/deleteEnrollment',  methods=['POST'])
def deleteEnrollment():
    try:
        # Check if the user is logged in by verifying session data
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401

        # Get the user's enrollments
        user_id = session['user_id']
        data = request.get_json()
        # Check if data is provided
        if not data:
            return jsonify({"error": "No data provided in the request body."}), 400
          
        result = DeleteEnrollment(data["class_id"],user_id)

        # Check if the result is empty or an error message
        if result:
            return jsonify({"message": "Succefully Deleted Enrollment"}),200
        else:
            return jsonify({"message": "Failed query error"}),400
    except KeyError as e:
        # Handle missing session data
        return jsonify({"error": f"Missing session key: {str(e)}"}), 400

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    
@enrollment.route('/api/getExerciseTypes',  methods=['GET'])
def getExerciseTypes():

    result = GetAllExerciseTypes()

    if not result:
            return jsonify({"message": "No enrollments found for the user."}), 404

    if isinstance(result, str) and "error" in result.lower():
        return jsonify({"error": result}), 500  # Custom error from SelectUserEnrollments

        # Successfully retrieved enrollments
    return jsonify({"types": result}), 200







    
