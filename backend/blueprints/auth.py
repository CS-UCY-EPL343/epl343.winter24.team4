from flask import Blueprint
from flask import render_template
from requests import request

auth = Blueprint('auth', __name__)


@auth.route('/login')
def login():
    return "OK" #render_template('auth/login.html')


@auth.route('/signup')
def signup(): 
    return 'OK' #render_template('auth/signup.html')

