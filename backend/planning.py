# This file handles brainstorming the design hypothesis and creating the task list.
import json

import globals

client = globals.client

sample_plan = """
[{'task_id': 1, 'task': "Create the HTML table structure with headers which include 'title', 'type', 'quantity', 'price', 'expiration_date', and 'rating'.", 'dep': []}, {'task_id': 2, 'task': "In each row, add HTML elements (text inputs, drop-downs, date pickers, etc.) for the respective fields, also add a 'details' button. Add placeholder inventory rows.", 'dep': [1]}, {'task_id': 3, 'task': "Implement JavaScript code to give functionality to the detail button. On click, it should generate a pop-up or modal showing all the data from the row, including the 'description'.", 'dep': [2]}, {'task_id': 4, 'task': 'Implement JavaScript code to make the table rows interactive, allowing operations such as add, delete and update.', 'dep': [2]}, {'task_id': 5, 'task': 'Implement JavaScript code to sort the table by any field when the user clicks on a column header.', 'dep': [2, 4]}, {'task_id': 6, 'task': 'Add a search bar and implement JavaScript for searching items in inventory table, add functionality to filter the displayed table rows based on search text.', 'dep': [2, 4, 5]}]
"""


def get_design_hypothesis(ui_prompt, faked_data):
    print("calling GPT for get_design_hypothesis...")
    prompt = f"""
        This is the UI prompt: {ui_prompt}
        This is the faked_data: {faked_data}
    """
    messages = [
        {
            "role": "system",
            "content": """
                You are a UI designer who wants to create the best UI suitable for the application the user wants, given the data model the user wants to visualize. 
				Each design should detail the user interactions and design layout. It should not be more than 100 words long.

                Make sure the design is consistent with the json data object provided by the user. All data shown must exist as a field on the JSON object.
				
				For example, a response could be: To create an application where the user can store their notes app, I will create a gmail, table-like UI, that shows the "title" field of the note. The user can search for notes, delete notes, and add notes. When the user clicks on a row, they will be brought to the full note.
            """,
        },
        {"role": "user", "content": prompt},
    ]
    res = client.chat.completions.create(model="gpt-4", messages=messages)
    print("sucessfully called GPT for get_design_hypothesis", res)
    return res.choices[0].message.content


def get_plan(design_hypothesis):
    print("calling GPT for get_plan...")
    prompt = f"""I want to create a UI with this design: {design_hypothesis}.
        Give me a detailed implementation plan based on this design - the plan should be a list of tasks.
		Assume all the code will exist in one index.html file, and that the UI will render in one page with no backend. 
		There is no need for design mockups, wireframes, or external libraries. We just want to build a simple usable UI component. 
		The first step of the plan should be creating the HTML structure of the design hypothesis.
        Placeholder data already exists. There should be NO task for mocking placeholder data, or populating the cards with placeholder data, since that already exists.
		Format it like this: [{{"task_id: task_id, "task": task, "dep": dependency_task_ids}}]. 
		The "dep" field denotes the id of the previous tasks which generates a new resource upon which the current task relies.
		
        Here is an example of the level of detail that should be included in a plan: {sample_plan}
		Please limit the plan to three to six steps.
		"""
    messages = [
        {
            "role": "system",
            "content": "You are a helpful software engineer to answer questions related to implementing this UI.",
        },
        {"role": "user", "content": prompt},
    ]
    res = client.chat.completions.create(model="gpt-4", messages=messages)
    plan = cleanup_plan(res.choices[0].message.content)
    print("sucessfully called GPT for get_plan", res)
    return plan


#  To do: make this recursive so that if the plan cannot be parsed into a json file, we recall GPT until its a valid JSON array
def cleanup_plan(plan):
    print("calling GPT for cleanup_plan...")
    prompt = f"Please clean up the plan so it only returns the json array. This is the plan: {plan}"
    messages = [
        {
            "role": "system",
            "content": """You are an assistant to clean up GPT responses into a json array.
			The response should be as formatted: [
                {
                    "task_id": 1,
                    "task": "Create a static table with sample rows",
                    "dep": [],
                },
                {
                    "task_id": 2,
                    "task": "Add column headers",
                    "dep": [1],
                },
            ]
            """,
        },
        {"role": "user", "content": prompt},
    ]
    res = client.chat.completions.create(model="gpt-4", messages=messages)
    print("sucessfully called GPT for cleanup_plan", res)
    cleaned_plan = res.choices[0].message.content
    try:
        cleaned_plan_json = json.loads(cleaned_plan)
        return cleaned_plan_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_plan(plan)
