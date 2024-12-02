from flask import Blueprint, redirect, request, render_template, jsonify, session, url_for
from scripts.user.addNewUser import AddNewUserToDb
import bcrypt
import re

api = Blueprint('api', __name__)


@api.route('/api/logged_in', methods=['GET'])
def isAdmin():
    if request.method == 'GET':
        return jsonify(logged_in='user_id' in session)