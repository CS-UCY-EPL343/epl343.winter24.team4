from flask import Blueprint, redirect, request, render_template, jsonify, session, url_for

from scripts.payment.addPayment import addPayment
from scripts.payment.selectPaymentTypes import PaymentTypes
from scripts.selectAllUsers import getAllUsers,getUserClasses
from scripts.user.addNewUser import AddNewUserToDb
import bcrypt
import re

api = Blueprint('api', __name__)


@api.route('/api/logged_in', methods=['GET'])
def isAdmin():
    if 'user_id' in session:
        # Return JSON response with logged_in as True if 'user_id' exists in session
        return jsonify(logged_in=True)
    else:
        # Return JSON response with logged_in as False if 'user_id' does not exist in session
        return jsonify(logged_in=False)


@api.route('/api/getAllUsers', methods=['GET'])
def getUsers():
    if not 'user_id' in session:
            return jsonify({"error": "You are not logged in"})
    if session['isAdmin']:
        return jsonify(users = getAllUsers())


@api.route('/api/getUsersClasses', methods=['GET'])
def getUsersClasses():
    if not 'user_id' in session:
            return jsonify({"error": "You are not logged in"})
    if session['isAdmin']:
        return jsonify(getUserClassesForMonth(request.args.get('user_id')))


@api.route('/api/insertPayment', methods=['POST'])
def insertPayment():
    if 'user_id' not in session:
        return jsonify({"error": "You are not logged in"}), 401
    if session['isAdmin']:
        try:
            data = request.json
            user_id = data.get('user_id')
            class_id = data.get('class_id')
            payment_type = data.get('payment_type')

            # Validate inputs
            if not class_id or not payment_type:
                return jsonify({"error": "Missing required fields (class_id, payment_type, amount)"}), 400

            # Insert payment
            result = addPayment(user_id, class_id, payment_type)

            if result:  # Assuming `execute_query_dict` returns True/False for success
                return jsonify({"message": "Payment inserted successfully"}), 201
            else:
                return jsonify({"error": "Failed to insert payment"}), 500

        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@api.route('/api/fetchPaymentType', methods=['GET'])
def fetchPaymentType():
    if 'user_id' not in session:
        return jsonify({"error": "You are not logged in"}), 401
    if session['isAdmin']:
        return jsonify(PaymentTypes())

@api.route('/api/getCurrentUserClasses', methods=['GET'])
def getCurrentUserClasses():
    if not 'user_id' in session:
            return jsonify({"error": "You are not logged in"})
    return jsonify(getUserClasses(session['user_id']))