from flask import Flask, render_template, request
import json, random

app = Flask(__name__)
w = json.load(open('worldl.json'))


@app.route('/')
def root():
	return render_template('index.html', w = w, al = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'], 
	continentList = sorted(list(set([c['continent'] for c in w]))))

@app.route('/continent/<cont>')
def continent(cont):
	countryList = [c for c in w if c['continent']==cont]
	return render_template('continent.html',cont = cont, countryList = countryList)

@app.route('/country/<n>')
def country(n):
	for c in w:
		if c['name'] == n:
			return render_template('country.html', c = c, continentList = sorted(list(set([c['continent'] for c in w]))))
	

@app.route('/find')
def find():
	for c in w:
		if c['name'] == request.args.get('scn').capitalize():
			return render_template('country.html', c = c)
	return "Sorry, we did not find " + request.args.get('scn')

def rsort(r):
	if r is None:
		return -float('inf')
	else:
		return r

@app.route('/rankinfo/<ri>')
def rankinfo(ri):
	w.sort(key = lambda x:rsort(x[ri]), reverse = True)
	rankinfo = [ c for c in w]
	return render_template ('rsort.html', ri = ri, countryList = rankinfo)

@app.route('/alpha/<a>')
def alpha(a):
	return render_template('alpha.html', w = [c for c in w if c['name'].startswith(a)], a = a)
	
@app.route('/delete/<name>')
def delete(name):
	global w
	w = [c for c in w if c['name'] != name]
	return "Successfully deleted %s" % name

@app.route('/quiz')
def quiz():
	return render_template('quiz.html')

@app.route('/randomf')
def randomc():
	r = random.randint(0,len(w)-1)
	return json.dumps(w[r]);

@app.route('/addCountry', methods = ['POST', 'GET'])
def addCountry():
	newC = {}
	newC['name'] = request.form['c-name']
	newC['capital'] = request.form['c-cap']
	newC['continent'] = request.form['c-cont']
	newC['area'] = int(request.form['c-area'])
	newC['population'] = int(request.form['c-popu'])
	newC['gdp'] = int(request.form['c-gdp'])
	newC['tld'] = request.form['c-tld']
	newC['id'] = int(w[len(w)-1]['id']) + 1
	newC['flag'] = request.form['c-flag']
	w.append(newC)
	w.sort(key = lambda c: c['name'])
	return "Successfully Added for %s" %request.form['c-name']

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5535, debug=True) #if some error happened the system will show
else:
    from werkzeug.debug import DebuggedApplication
    app.wsgi_app = DebuggedApplication(app.wsgi_app, True)
    app.debug = True
