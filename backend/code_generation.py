# This file handles saving mocked data, generating, and cleaning up the code based on the task list
import json

import globals
from utils import (
    add_comment_to_html_file,
    create_and_write_file,
    create_folder,
    read_file,
)

client = globals.client

# HOW CODE GENERATION FOLDER WORKS
# - They will all rest in generated/generations_[timestamp]_[uuid]
# - They will all have a faked_data.json file

# - for lock step
# [code_folder_path]/index.html - main code that is changed and updated constantly
# [code_folder_path]/checked.html - after all the steps, the final checked code
# [code_folder_path]/cleaned.html - after all the steps, the final cleaned code
# [code_folder_path]/[task_id]/index.html - initial generated code per task_id
# [code_folder_path]/[task_id]/checked.html - checked generated code per task_id
# [code_folder_path]/[task_id]/cleaned.html - cleaned generated code per task_id

# for one shot
# index.html - main code that is changed and updated constantly
# initial.html - initial code
# checked.html - checked code
# cleaned.html - cleaned code

def get_fake_data(data_model):
	print("calling GPT for get_fake_data...")
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
        {"role": "user", "content": "please generate data given this data model: " + data_model}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	print("sucessfully called GPT for get_fake_data", res);
	return res.choices[0].message.content

# this code generated is one shot
def implement_plan(prompt, plan, faked_data, design_hypothesis, code_folder_path):
	print("calling GPT for implement_plan...")
	checked_code_file_path = f"{code_folder_path}/{globals.CHECKED_CODE_FILE_NAME}"
	cleaned_code_file_path = f"{code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	initial_code_file_path = f"{code_folder_path}/initial.html"
	main_code_file_path = f"{code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
	get_ui_code(prompt, plan, faked_data, design_hypothesis, initial_code_file_path, main_code_file_path)
	overall_check(design_hypothesis, checked_code_file_path, main_code_file_path)
	cleanup_code(faked_data, cleaned_code_file_path, main_code_file_path)
	return main_code_file_path

def get_ui_code(prompt, plan, faked_data, design_hypothesis, initial_code_file_path, main_code_file_path):
	print("calling GPT for get_ui_code...")
	this_prompt = f"This is the UI {prompt}. To build the UI, follow these steps {plan} it should use all this data: {faked_data}"
	messages = [
        {
            "role": "system",
            "content": f"""
                You are writing javascript, HTML, CSS for creating a UI given a data model. This is the goal: {design_hypothesis}. The design should meet the following user specifications:
                
                Please follow these rules while writing the code.
                1. A code snippet should be followed by a short explanation summarizing what the code is doing as a code comment, not natural language. The explanation should be no more than 15 words long. 
                2. If previous code exists, please have the new code improve the existing code. Do not start completely from scratch.
				3. Only write javascript, html, and css code. Do not have any natural language unless it is wrapped in a comment
				4. Do not return separate javascript, HTML, and CSS code. Compile it all together in one file and only send me the code. 
				5. There should be no natural language at all. The entire response should be code. 
            """,
        },
        {"role": "user", "content": this_prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	code = res.choices[0].message.content
	create_and_write_file(initial_code_file_path, code)
	create_and_write_file(main_code_file_path, code)
	print("sucessfully called GPT for get_ui_code", res);
	return code

def implement_plan_lock_step(design_hypothesis, plan, faked_data, code_folder_path):
	print("calling GPT for implement_plan_lock_step...")
	if len(plan) == 0 or plan is None:
		print("ERROR: there was no plan...")
		return ""
	previous_tasks = []
	checked_code_file_path = f"{code_folder_path}/{globals.CHECKED_CODE_FILE_NAME}"
	cleaned_code_file_path = f"{code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	main_code_file_path = f"{code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"

	for step in plan:
		print(f"for implement_plan, implementing task_id: {step["task_id"]}")
		task_code_folder_path = f"{code_folder_path}/{step["task_id"]}"
		create_folder(task_code_folder_path)
		task_checked_code_file_path = f"{task_code_folder_path}/{globals.CHECKED_CODE_FILE_NAME}"
		task_cleaned_code_file_path = f"{task_code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
		task_main_code_file_path = f"{task_code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
		previous_task_main_code_file_path = f"{code_folder_path}/{step["task_id"]-1}/{globals.MAIN_CODE_FILE_NAME}" if step["task_id"] > 1 else ""

		implement_task_per_lock_step(faked_data, design_hypothesis, step["task"], step["task_id"], previous_tasks, task_main_code_file_path, main_code_file_path)
		check_code_per_lock_step(step["task"], previous_tasks, design_hypothesis, task_checked_code_file_path, previous_task_main_code_file_path, main_code_file_path)
		cleanup_code(faked_data, task_cleaned_code_file_path,main_code_file_path)
		previous_tasks.append(step["task"])
	overall_check(design_hypothesis, checked_code_file_path, main_code_file_path)
	cleanup_code(faked_data, cleaned_code_file_path, main_code_file_path)
	return main_code_file_path

def implement_task_per_lock_step(faked_data, design_hypothesis, task, task_id, previous_tasks, task_main_code_file_path, main_code_file_path):
	print("calling GPT for implement_task_per_lock_step...")
	existing_code = read_file(main_code_file_path) if task_id > 1 else ""
	this_prompt = f"Please execute this task: {task}. This is the existing code: {existing_code}"
	messages = [
        {
            "role": "system",
            "content": f"""
                You are writing javascript, HTML, CSS for creating a UI given a data model.
							
				We want to iterate on the existing code by executing the task that the user specifies. 
				Previously, the code performed these tasks: {previous_tasks}. Keep the functionality of the previous tasks. Do not leave out previous code and comment // existing code here
				
				For context, this is the goal: {design_hypothesis}. This is the faked_data: {faked_data}
                
                Please follow these rules while writing the code.
                1. Please have the new code improve the existing code. Do not delete existing functionality in the code. Do not start completely from scratch.
				2. Only write javascript, html, and css code.
				3. Do not return separate javascript, HTML, and CSS code. Compile it all together in one file and only send me the code. 
				4. Please incorporate the faked_data to mock interactions
            """,
        },
        {"role": "user", "content": this_prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	code = res.choices[0].message.content
	create_and_write_file(task_main_code_file_path, code)
	create_and_write_file(main_code_file_path, code)
	print("sucessfully called GPT for implement_task", res)

def check_code_per_lock_step(task, previous_tasks, design_hypothesis, task_checked_code_file_path, previous_task_main_code_file_path, main_code_file_path):
    print("calling GPT for check_code_per_lock_step...")
    previous_code = read_file(previous_task_main_code_file_path) if previous_task_main_code_file_path else ""
    code = read_file(main_code_file_path)
    prompt=f"This is the code to check: {code}, with this task: {task}"
    messages = [
        {
            "role": "system",
            "content": f"""
                You are reviewing code for a specific task to build this design: {design_hypothesis}. The user will provide the task the code is supposed to complete.
				Please ensure that the code is doing what the task says. 
				
				If it is not, update the code to do what the tasks suggests, but ensure that the functionality from the previous tasks are preserved. These were the previous tasks: {previous_tasks}
				If code was commented out, add the previous code's functionality into the current code. This is the previous code: {previous_code}
                
				The response should be formatted as follows: {{"approved": approved, "modified_code": modified_code, "what_was_changed": what_was_changed}},
				where "modified_code" is a the updated html wrapped in a string,
				where "what_was_changed" describes what was updated wrapped in a string,
				where "approved" is a boolean. If the original code does what the task wants, then approved should be true. If not, approved should be false.
				If "approved" is false, then "modified_code" should contain the modified code that does what the task wants, and "what_was_changed" should describe what was changed. If "approved" is true, then "modified_code" and "what_was_changed" should be null.

				Only return the json object as the response.   
            """,
        },
        {"role": "user", "content": prompt}
    ]
    res = client.chat.completions.create(model="gpt-4", messages=messages)
    print("sucessfully called GPT for check_code", res)
    try:
        result = json.loads(res.choices[0].message.content)
        checked_code = code if result["approved"] else result["modified_code"]
        create_and_write_file(task_checked_code_file_path, checked_code)
        create_and_write_file(main_code_file_path, checked_code)
        if not result["approved"]:
            add_comment_to_html_file(task_checked_code_file_path, result["what_was_changed"])
        print("successfully parsed GPT response for check_code")
    except json.JSONDecodeError:
        print("JSON decoding failed. Retrying...")
        check_code_per_lock_step(task, previous_tasks, design_hypothesis, task_checked_code_file_path, previous_task_main_code_file_path, main_code_file_path)

def overall_check(design_hypothesis, checked_code_file_path, main_code_file_path):
	print("calling GPT for overall_check...")
	code = read_file(main_code_file_path)
	prompt=f"This is the code: {code}"
	messages = [
        {
            "role": "system",
            "content": f"""
                You are reviewing code for a UI design: {design_hypothesis} The user will provide the task the code is supposed to complete.
				Please ensure that the code provided by the user is doing what the design asks. If there are comments in the code for functionality that is incomplete, please iterate on the existing code and add the functionality. 
				
				If it is not, please fix the code so that it does what the design asks for and return the modified code.
			""",
        },
        {"role": "user", "content": prompt}
    ]
	res = client.chat.completions.create(model="gpt-4", messages=messages)
	checked_code = res.choices[0].message.content
	create_and_write_file(checked_code_file_path, checked_code)
	create_and_write_file(main_code_file_path, checked_code)
	print("sucessfully called GPT for overall_check", res)

def cleanup_code(data, cleaned_code_file_path, main_code_file_path):
	print("calling GPT for cleanup_code...")
	code = read_file(main_code_file_path)
	prompt = f'This is the code: \n {code} \n\n This is the data: {data}'
	messages = [
        {
            "role": "system",
            "content": """
                You are cleaning up javascript and HTML code to ensure that it runs on first try. Additionally, you are inputting all sample data provided by the user to hardcode it into the code if the code asks for it.
                
                Please follow these rules while cleaning up the code.
                1. There should be no natural language at all. The entire response should be code. 
				2. This is an EXAMPLE of a result: <!DOCTYPE html>
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
	create_and_write_file(cleaned_code_file_path, cleaned_code)
	create_and_write_file(main_code_file_path, cleaned_code)
	print("successfully called gpt for cleanup_code: " + cleaned_code)