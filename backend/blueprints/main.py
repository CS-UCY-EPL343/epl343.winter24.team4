from flask import Blueprint, render_template, session

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template("home.html",
                           logged_in = 'user_id' in session
                           )

@main.route('/profile')
def profile():
    return render_template("profile.html")


