import json

from flask import Flask, jsonify, render_template

app = Flask(__name__)

# Loading JSON data
with open('data/labs.json', 'r') as file:
    timetable_data = json.load(file)

@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    return jsonify(timetable_data)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)




