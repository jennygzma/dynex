# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, request
import openai

from openai import OpenAI
import datetime
import uuid
import json
from planning import get_design_hypothesis, get_plan
from code_generation import implement_plan, implement_plan_iterative, get_fake_data

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

client = OpenAI(api_key="")

prompt = None; # user provided prompt for what UI should look like
faked_data = None; # GPT generated faked data
data_model = None; # user provided 
design_hypothesis = None; # GPT generated design 
plan = None; # GPT generated implementation plan 

@app.route("/generate_fake_data", methods=["POST"])
def generate_fake_data():
	global data_model;
	print("calling generate_fake_data...")
	data = request.json
	data_model = data["data_model"]
	data= get_fake_data(data_model)
	# print("for generate_fake_data, fake_data:", data)
	return jsonify({"message": "Generated code", "fake_data": data}), 200

@app.route("/save_faked_data", methods=["POST"])
def save_faked_data():
	global faked_data
	print("calling save_faked_data...")
	data = request.json
	faked_data = data["faked_data"]
	# print("for saved_faked_data, data:" + faked_data)
	return jsonify({"message": "Saved faked data", "data": faked_data}), 200

@app.route("/generate_design_hypothesis", methods=["POST"])
def generate_design_hypothesis():
	global design_hypothesis
	global prompt
	print("calling generate_design_hypothesis...")
	data = request.json
	prompt = data["prompt"]
	design_hypothesis = get_design_hypothesis(prompt, data_model)
	# print("for generate_design_hypothesis, design_hypothesis:", design_hypothesis)
	return jsonify({"message": "Generated design hypothesis", "hypothesis": design_hypothesis}), 200
		
@app.route("/generate_plan", methods=["POST"])
def generate_plan():
	global plan
	print("calling generate_plan...")
	stringified_plan = get_plan(design_hypothesis)
	plan = json.loads(stringified_plan)
	return jsonify({"message": "Generated Plan", "plan": stringified_plan}), 200

@app.route("/generate_code", methods=["GET"])
def generate_code():
	print("calling generate_code...")
	# code= implement_plan_iterative(design_hypothesis, plan, faked_data)
	code = implement_plan(prompt, plan, faked_data, design_hypothesis)
	return jsonify({"message": "Generated code", "code": code}), 200

# Running app
if __name__ == '__main__':
	app.run(debug=True)
