from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return "Home"

@main.route('/home')
def hom():
    return render_template("home.html")