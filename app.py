from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Rules (Expert system)
rules = [
    (["fever", "cough", "sore_throat"], "Flu"),
    (["fever", "headache", "joint_pain"], "Dengue"),
    (["fever", "rash"], "Measles"),
    (["cough", "chest_pain", "breathing_issue"], "Pneumonia"),
    (["fever", "cough", "loss_of_smell"], "Covid-19"),
    (["fever", "fatigue", "body_ache"], "Typhoid"),
    (["fever", "chills", "vomiting"], "Malaria"),
    (["vomiting", "diarrhea"], "Food Poisoning"),
    (["runny_nose", "cough"], "Cold"),
    (["joint_pain", "fatigue"], "Arthritis")
]

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    symptoms = data.get("symptoms", [])

    result = []

    for conds, disease in rules:
        if all(c in symptoms for c in conds):
            result.append(disease)

    return jsonify({"disease": result})

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    symptoms = data.get("symptoms", [])

    # normalize input
    symptoms = [s.strip().lower() for s in symptoms]

    result = []

    for conds, disease in rules:
        if all(c in symptoms for c in conds):
            result.append(disease)

    return jsonify({"disease": result})