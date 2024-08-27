# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, request
from openai import OpenAI
import datetime
import uuid

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

client = OpenAI(api_key="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")

faked_data = None;
design_hypotheses_map = {};
prompt_map = {};
iteration_index = 0;
existing_code = None;

@app.route("/generate_design_hypotheses", methods=["POST"])
def generate_design_hypotheses():
	global design_hypotheses_map
	global prompt_map 
	global iteration_index
	print("calling generate_design_hypotheses...")
	data = request.json
	prompt = data["ui_prompt"]
	prompt_map[iteration_index] = prompt
	results = ["", "", ""]
	for i in range(3):
		print("calling for design hypothesis " + str(i))
		results[i] = get_design_hypothesis(prompt, "") if iteration_index == 0 else get_design_hypothesis(prompt, prompt_map[iteration_index-1])
	print("id for this design hypothesis generation is " + str(iteration_index))
	design_hypotheses_map[iteration_index] = results
	iteration_index = iteration_index + 1
	return jsonify({"message": "Generated design hypotheses", "hypotheses": results}), 200

		
def get_design_hypothesis(ui_prompt_current, ui_prompt_previous):
	print("calling get_design_hypothesis...")
	prompt = "This is the UI the user wants: "
	if ui_prompt_previous:
		prompt = prompt + ui_prompt_previous + " with these improvements " + ui_prompt_current
	else:
		prompt = prompt + ui_prompt_current
		
	messages = [
		{
			"role": "system",
			"content": f"""
                You are a UI designer who wants to create the best UI suitable for the application the user wants. 
				Each design should detail the user interactions and design layout. It should not be more than {(iteration_index+1)*50} words long
				For example, a response could be: To create an application where the user can store their notes app, I will create a gmail, table-like UI. The user can search for notes, delete notes, and add notes. When the user clicks on a row, they will be brought to the full note.
            """,
        },
		{"role": "user", "content": prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	print("Sucessfully called GPT for design hypothesis", res);
	return res.choices[0].message.content


@app.route("/generate_code", methods=["POST"])
def generate_code():
	global faked_data
	global existing_code
	print("calling generate_code...")
	data = request.json
	ui_prompt = data["design"]
	code= get_ui_code(ui_prompt, faked_data)
	print("code is ", code)
	cleaned_code=cleanup_code(code, faked_data)
	existing_code = cleaned_code
	return jsonify({"message": "Generated code", "code": cleaned_code}), 200

def get_ui_code(ui_prompt, data_input):
	global existing_code
	prompt = "This is the UI the user wants: " + ui_prompt + "\n it should use all this data: " + data_input
	if (existing_code):
		prompt = prompt + "\n and it should build upon the existing code: " + existing_code
	messages = [
        {
            "role": "system",
            "content": """
                You are writing javascript, HTML, CSS for creating a UI given a data model. The design should meet the following user specifications:
                
                Please follow these rules while writing the code.
                1. A code snippet should be followed by a short explanation summarizing what the code is doing as a code comment, not natural language. The explanation should be no more than 15 words long. 
                2. If previous code exists, please have the new code improve the existing code. Do not start completely from scratch.
				3. Only write javascript, html, and css code. Do not have any natural language unless it is wrapped in a comment
				4. Do not return separate javascript, HTML, and CSS code. Compile it all together in one file and only send me the code. 
				5. There should be no natural language at all. The entire response should be code. 
				6. The result should be something like this: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinder-like Character UI</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #ececec; }
        .card { width: 300px; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px; padding: 20px; text-align: center; }
        .card img { max-width: 100%; border-radius: 10px; }
        .buttons { text-align: center; margin-top: 20px; }
        button { padding: 10px 20px; margin: 0 10px; border: none; border-radius: 5px; cursor: pointer; }
        .like { background-color: #4CAF50; color: white; }
        .dislike { background-color: #f44336; color: white; }
    </style>
</head>
<body>

<div class="card">
    <img src="" alt="Character Image" id="charImage">
    <h2 id="charTitle"></h2>
    <p id="charDescription"></p>
</div>

<div class="buttons">
    <button class="dislike" onclick="changeCharacter(-1)">Dislike</button>
    <button class="like" onclick="changeCharacter(1)">Like</button>
</div>

<script>
const characters = [
    { title: "Monkey D Luffy", description: "Role: Straw Hat Pirate, Captain. Fun Fact: Is Dumb. Favorite Moment: Helping Nami", imagePath: "luffyImage.jpeg" }, 
    { title: "Roronoa Zoro", description: "Role: Straw Hat Pirate, Right Wing. Fun Fact: Gets Lost. Favorite Moment: Nothing Happened", imagePath: "zoroImage.jpeg" }, 
    { title: "Vinsmoke Sanji", description: "Role: Straw Hat Pirate, Chef, Left Wing. Fun Fact: Nose bleeds. Favorite Moment: Bowing to Zeff", imagePath: "sanjiImage.jpeg" }, 
    { title: "Nami", description: "Role: Straw Hat Pirate, Navigator. Fun Fact: Thief. Favorite Moment: Asking Luffy for help", imagePath: "namiImage.jpeg" }, 
    { title: "Usopp", description: "Role: Straw Hat Pirate, Sniper. Fun Fact: Liar. Favorite Moment: Enies Lobby", imagePath: "usoppImage.jpeg" }, 
    { title: "Tony Tony Chopper", description: "Role: Straw Hat Pirate, Doctor. Fun Fact: Cotton Candy. Favorite Moment: Doctorine Arc", imagePath: "chopperImage.jpeg" }, 
    { title: "Nico Robin", description: "Role: Straw Hat Pirate, Archaeologist. Fun Fact: Randomly got pale. Favorite Moment: One day you will find friends", imagePath: "robinImage.jpeg" }, 
    { title: "Franky", description: "Role: Straw Hat Pirate, Shipwright. Fun Fact: Coca Cola. Favorite Moment: Stopping train", imagePath: "frankyImage.jpeg" }, 
    { title: "Brook", description: "Role: Straw Hat Pirate, Musician. Fun Fact: .... Favorite Moment: Bink's Sake", imagePath: "brookImage.jpeg" }, 
    { title: "Shanks", description: "Role: Red-Haired Pirate, Captain. Fun Fact: Is Cool. Favorite Moment: Saving Luffy", imagePath: "shanksImage.jpeg" }
];

let currentIndex = 0;

function displayCharacter(index) {
    const { title, description, imagePath } = characters[index];
    document.getElementById('charImage').src = imagePath; // Placeholder, replace with actual paths or URLs
    document.getElementById('charImage').alt = title;
    document.getElementById('charTitle').innerText = title;
    document.getElementById('charDescription').innerText = description;
}

function changeCharacter(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = characters.length - 1;
    if (currentIndex >= characters.length) currentIndex = 0;
    displayCharacter(currentIndex);
}

displayCharacter(currentIndex);
</script>

</body>
</html>
            """,
        },
        {"role": "user", "content": prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	print("Sucessfully called GPT for code", res);
	return res.choices[0].message.content

def cleanup_code(code, data):
	prompt = f'This is the code: \n {code} \n\n This is the data: {data}'
	messages = [
        {
            "role": "system",
            "content": """
                You are cleaning up javascript and HTML code to ensure that it runs on first try. Additionally, you are inputting all sample data provided by the user to hardcode it into the code if the code asks for it.
                
                Please follow these rules while cleaning up the code.
                1. There should be no natural language at all. The entire response should be code. 
				2. The result should be something like this: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinder-like Character UI</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #ececec; }
        .card { width: 300px; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px; padding: 20px; text-align: center; }
        .card img { max-width: 100%; border-radius: 10px; }
        .buttons { text-align: center; margin-top: 20px; }
        button { padding: 10px 20px; margin: 0 10px; border: none; border-radius: 5px; cursor: pointer; }
        .like { background-color: #4CAF50; color: white; }
        .dislike { background-color: #f44336; color: white; }
    </style>
</head>
<body>

<div class="card">
    <img src="" alt="Character Image" id="charImage">
    <h2 id="charTitle"></h2>
    <p id="charDescription"></p>
</div>

<div class="buttons">
    <button class="dislike" onclick="changeCharacter(-1)">Dislike</button>
    <button class="like" onclick="changeCharacter(1)">Like</button>
</div>

<script>
const characters = [
    { title: "Monkey D Luffy", description: "Role: Straw Hat Pirate, Captain. Fun Fact: Is Dumb. Favorite Moment: Helping Nami", imagePath: "luffyImage.jpeg" }, 
    { title: "Roronoa Zoro", description: "Role: Straw Hat Pirate, Right Wing. Fun Fact: Gets Lost. Favorite Moment: Nothing Happened", imagePath: "zoroImage.jpeg" }, 
    { title: "Vinsmoke Sanji", description: "Role: Straw Hat Pirate, Chef, Left Wing. Fun Fact: Nose bleeds. Favorite Moment: Bowing to Zeff", imagePath: "sanjiImage.jpeg" }, 
    { title: "Nami", description: "Role: Straw Hat Pirate, Navigator. Fun Fact: Thief. Favorite Moment: Asking Luffy for help", imagePath: "namiImage.jpeg" }, 
    { title: "Usopp", description: "Role: Straw Hat Pirate, Sniper. Fun Fact: Liar. Favorite Moment: Enies Lobby", imagePath: "usoppImage.jpeg" }, 
    { title: "Tony Tony Chopper", description: "Role: Straw Hat Pirate, Doctor. Fun Fact: Cotton Candy. Favorite Moment: Doctorine Arc", imagePath: "chopperImage.jpeg" }, 
    { title: "Nico Robin", description: "Role: Straw Hat Pirate, Archaeologist. Fun Fact: Randomly got pale. Favorite Moment: One day you will find friends", imagePath: "robinImage.jpeg" }, 
    { title: "Franky", description: "Role: Straw Hat Pirate, Shipwright. Fun Fact: Coca Cola. Favorite Moment: Stopping train", imagePath: "frankyImage.jpeg" }, 
    { title: "Brook", description: "Role: Straw Hat Pirate, Musician. Fun Fact: .... Favorite Moment: Bink's Sake", imagePath: "brookImage.jpeg" }, 
    { title: "Shanks", description: "Role: Red-Haired Pirate, Captain. Fun Fact: Is Cool. Favorite Moment: Saving Luffy", imagePath: "shanksImage.jpeg" }
];

let currentIndex = 0;

function displayCharacter(index) {
    const { title, description, imagePath } = characters[index];
    document.getElementById('charImage').src = imagePath; // Placeholder, replace with actual paths or URLs
    document.getElementById('charImage').alt = title;
    document.getElementById('charTitle').innerText = title;
    document.getElementById('charDescription').innerText = description;
}

function changeCharacter(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = characters.length - 1;
    if (currentIndex >= characters.length) currentIndex = 0;
    displayCharacter(currentIndex);
}

displayCharacter(currentIndex);
</script>

</body>
</html>
            """,
        },
        {"role": "user", "content": prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	cleaned_code = res.choices[0].message.content
	print("cleaned code is: " + cleaned_code)
	return cleaned_code
	
@app.route("/generate_fake_data", methods=["POST"])
def generate_fake_data():
	print("calling generate_fake_data...")
	data = request.json
	data_model_prompt = data["data_model_prompt"]
	data= get_fake_data(data_model_prompt)
	print("faked data is", data)
	return jsonify({"message": "Generated code", "fake_data": data}), 200

def get_fake_data(data_model_prompt):
	messages = [
        {
            "role": "system",
            "content": """
                You are generating fake JSON data given a data model. Given an example data model, please use that model to generate a JSON array of fake data. Here is an example:
				
				User Input:
                {
                    "id": 11,
                    "title": "perfume Oil",
                    "description": "Mega Discount, Impression of A...",
                    "price": 13,
                    "discountPercentage": 8.4,
                    "rating": 4.26,
                    "stock": 65,
                    "brand": "Impression of Acqua Di Gio",
                    "category": "fragrances",
                }
				
				System result:
				[
                    {
                        "id": 11,
                        "title": "perfume Oil",
                        "description": "Mega Discount, Impression of A...",
                        "price": 13,
                        "discountPercentage": 8.4,
                        "rating": 4.26,
                        "stock": 65,
                        "brand": "Impression of Acqua Di Gio",
                        "category": "fragrances",
                    },
					{
                        "id": 12,
                        "title": "perfume Oil",
                        "description": "Half Off",
                        "price": 15,
                        "discountPercentage": 12.3,
                        "rating": 3.46,
                        "stock": 2343,
                        "brand": "Victoria Secret",
                        "category": "fragrances",
                    },
                ]
                Please follow these rules while creating the JSON array
                1. Please only return the JSON array and nothing else.
				2. Array length should be length 10.
				3. Please ensure that the generated data makes sense. 
            """,
        },
        {"role": "user", "content": "please generate data given this data model: " + data_model_prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	print("Sucessfully called GPT for faked data", res);
	return res.choices[0].message.content

@app.route("/save_faked_data", methods=["POST"])
def save_faked_data():
	global faked_data
	data = request.json
	faked_data = data["faked_data"]
	print("saved faked data " + faked_data)
	return jsonify({"message": "Saved faked data", "data": faked_data}), 200

	
# Running app
if __name__ == '__main__':
	app.run(debug=True, port=5002)
