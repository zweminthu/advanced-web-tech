from flask import Flask, render_template, request

import sqlite3

app = Flask(__name__)

@app.route('/')
def root():
	return render_template ('index.html')


@app.route('/invoice', methods = ['POST'])
def invoice():
	con = sqlite3.connect('kiosk.db',uri=True)
	if request.method == 'POST':
		lp = request.form['license_plate']
		et = request.form['entry_time']
		du = request.form['duration']
		ch = request.form['charges']
		ap = request.form['amount_paid']
		cha = request.form['change']

		cur = con.cursor()
		cur.execute("insert into invoice (license_plate, entry_time, duration, amount_owed, amount_paid, change) values (?, ?, ?, ?, ?, ?) ", (lp, et, du, ch, ap, cha))
		con.commit()
	
	con.close()



if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5535, debug=True) #if some error happened the system will show
else:
    from werkzeug.debug import DebuggedApplication
    app.wsgi_app = DebuggedApplication(app.wsgi_app, True)
    app.debug = True