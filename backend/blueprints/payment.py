from flask import Blueprint, redirect, request, render_template, jsonify

payment = Blueprint('payment', __name__)

@payment.route('/pay', methods=['GET', 'POST'])
def makePayment():
    if request.method == 'GET':
        return render_template('pay.html')

    elif(request.method == 'POST'):
        pass; 

@payment.route('/payments', methods=['GET','POST'])
def payments():
    if(request.method == 'GET'):
        return render_template('payments.html')

