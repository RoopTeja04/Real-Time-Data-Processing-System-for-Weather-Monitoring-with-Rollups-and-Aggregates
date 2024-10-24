from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from rule_ast import create_rule, combine_rules, evaluate_rule

app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rules.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Rule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ast = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

@app.route('/create_rule', methods=['POST'])
def create_rule_endpoint():
    data = request.json
    rule_name = data.get('rule_name')
    rule_string = data.get('rule')

    rule_ast = create_rule(rule_string)  

    new_rule = Rule(name=rule_name, ast=rule_ast)
    db.session.add(new_rule)
    db.session.commit()

    return jsonify({'message': 'Rule created successfully!', 'rule_id': new_rule.id}), 201

@app.route('/combine_rules', methods=['POST'])
def combine_rules_endpoint():
    data = request.get_json()
    rules = data.get('rules', [])
    operators = data.get('operators', [])

    if len(rules) < 1:
        return jsonify(message="At least one rule is required"), 400

    combined_rule = rules[0] 

    for i in range(1, len(rules)):
        operator = operators[i - 1] 
        combined_rule += f' {operator} {rules[i]}'

    return jsonify(combined_rule=combined_rule)

@app.route('/evaluate_rule', methods=['POST'])
def evaluate_rule_endpoint():
    data = request.json
    rule_string = data.get('rule_string')
    attributes = data.get('attributes')

    safe_dict = {key: value for key, value in attributes.items()}

    operators = {
        "==": "==",
        "!=": "!=",
        ">": ">",
        "<": "<",
        ">=": ">=",
        "<=": "<=",
        "and": "and",
        "or": "or"
    }

    for op in operators:
        rule_string = rule_string.replace(op, operators[op])

    try:
        result = eval(rule_string, {"__builtins__": None}, safe_dict)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
