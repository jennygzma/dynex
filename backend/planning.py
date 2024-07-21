# This file handles brainstorming the design hypothesis and creating the task list.
import json

import globals

client = globals.client


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
		Assume all the code will exist in one react App.js file, and that the UI will render in one page with no backend.
		There is no need for design mockups, wireframes, or external libraries. We just want to build a simple usable UI component. 
        All the code will be in React and MUI.
        Placeholder data already exists. There should be NO task for mocking placeholder data, or populating the cards with placeholder data, since that already exists.
		Format it like this: [{{"task_id: task_id, "task": task, "dep": dependency_task_ids}}]. 
		The "dep" field denotes the id of the previous tasks which generates a new resource upon which the current task relies.
		
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
