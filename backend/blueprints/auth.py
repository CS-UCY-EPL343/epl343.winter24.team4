from flask import Blueprint, request
from flask import render_template


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        return 'post login'

    if request.method == 'GET':
        'login'  #return render_template('/login.html')


@auth.route('/signup', methods=['GET', 'POST'])
def signup(): 

    if request.method == 'POST':
        return 'signup success'
     
    if request.method == 'GET':
        return render_template('/signup.html')

