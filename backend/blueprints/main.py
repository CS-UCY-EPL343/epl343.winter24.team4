from flask import Blueprint, render_template, session, redirect, url_for

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template("home.html",
                           logged_in = 'user_id' in session
                           )

@main.route('/profile')
def profile():
    if 'user_id' in session:
        return render_template("profile.html")
    else: redirect(url_for('main.home'))


