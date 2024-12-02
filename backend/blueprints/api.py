from flask import Blueprint, redirect, request, render_template, jsonify, session, url_for
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
