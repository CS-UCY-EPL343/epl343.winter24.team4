from flask import session, url_for
from scripts.user.addNewUser import AddNewUserToDb
from .auth import is_admin
from flask import Blueprint, redirect, request, render_template


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