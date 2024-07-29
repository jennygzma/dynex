# This file handles brainstorming the design hypothesis and creating the task list.
import json

from globals import TASK_MAP_FILE_NAME, call_llm
from utils import read_file


def get_plan_from_task_map(folder_path):
    task_map_json = json.loads(read_file(f"{folder_path}/{TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    print("task_map", task_map)
    task_list = [
        {
            "task_id": task_id,
            "task": task_info["task"],
        }
        for task_id, task_info in sorted(task_map.items())
    ]
    return json.dumps(task_list)


def get_design_hypothesis(ui_prompt, faked_data):
    print("calling LLM for get_design_hypothesis...")
    user_message = f"""
        This is the UI prompt: {ui_prompt}
        This is the faked_data: {faked_data}
    """
    system_message = """
                You are a UI designer who wants to create the best UI suitable for the application the user wants, given the data model the user wants to visualize. 
				Each design should detail the user interactions and design layout. It should not be more than 100 words long.
                Make sure that the design does not incorporate routes. Everything should exist within one page.
                Make sure the design is consistent with the json data object provided by the user. All data shown must exist as a field on the JSON object.
				
				For example, a response could be: To create an application where the user can store their notes app, I will create a gmail, table-like UI, that shows the "title" field of the note. The user can search for notes, delete notes, and add notes. When the user clicks on a row, they will be brought to the full note.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for get_design_hypothesis", res)
    return res


def get_theories(user_prompt, existing_theories):
    print("calling LLM for get_theories...")
    user_message = f"This is the user prompt: {user_prompt}. These are the existing theories: {existing_theories}"
    system_message = """You are a helpful assistant that finds theories relevant to a specific domain given a user prompt.
    For example, if the user prompt is "create a UI to help me learn chinese", you should determine that the relevant theories would be in the "learning" domain, and return theories like spaced repetition, generation and elaboration, culturally relevant education, etc.
    However, you cannot return theories that the user already knows. This will be provided as existing theories.
    Format the theories in an array like so: ["spaced repetitition", "generation and elaboration"]
    Only return 3 theories.
    """
    res = "here are the theories: " + call_llm(system_message, user_message)
    theories = cleanup_theories(res)
    print("sucessfully called LLM for get_theories", res)
    return theories


#  To do: make this recursive so that if the plan cannot be parsed into a json file, we recall GPT until its a valid JSON array
def cleanup_theories(theories):
    print("calling LLM for cleanup_theories...")
    user_message = f"Please clean up the theories so it only returns the array of theories. These are the theories: {theories}"
    system_message = """You are an assistant to clean up GPT responses into an array.
			The response should be as formatted: "[
                "spaced repetition", "generation and elaboration", "culturally relevant education", "social learning"
            ]"
            Only the string form of the array should be returned. NOTHING OUTSIDE OF THE ARRAY SHOULD BE RETURNED.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for cleanup_theories", res)
    cleaned_theories = res
    try:
        cleaned_theories_json = json.loads(cleaned_theories)
        return cleaned_theories_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_theories(theories)


def get_plan(design_hypothesis):
    print("calling LLM for get_plan...")
    user_message = f"""I want to create a UI with this design: {design_hypothesis}.
        Give me a vague implementation plan that is feature-based. Each step should focus on implementing an interaction/feature.
        The first step should focus on creating the general structure of the app.
        For example, if creating a facebook news feed UI, the steps could be: 1) Create general structure of app. 2) Users should be able to post statuses and have it be added to the timeline. 3) Users should be able to like and comment on posts. 4) Users should be able to edit posts and delete posts.
		Assume all the code will exist in one react App.js file, and that the UI will render in one page with no backend.
		There is no need for design mockups, wireframes, or external libraries. We just want to build a simple usable UI component. 
        All the code will be in React and MUI.
        Make sure that the design does not incorporate routes. Everything should exist within one page.
        Placeholder data already exists. There should be NO task for mocking placeholder data, or populating the cards with placeholder data, since that already exists.
		Format it like this: [{{"task_id: task_id, "task": task, "dep": dependency_task_ids}}]. 
		The "dep" field denotes the id of the previous tasks which generates a new resource upon which the current task relies.
		Please limit the plan to 3-5 steps.
		"""
    system_message = "You are a helpful software engineer to answer questions related to implementing this UI."
    res = call_llm(system_message, user_message)
    plan = cleanup_plan(res)
    print("sucessfully called LLM for get_plan", res)
    return plan


#  To do: make this recursive so that if the plan cannot be parsed into a json file, we recall GPT until its a valid JSON array
def cleanup_plan(plan):
    print("calling LLM for cleanup_plan...")
    user_message = f"Please clean up the plan so it only returns the json array. This is the plan: {plan}"
    system_message = """You are an assistant to clean up GPT responses into a json array.
			The response should be as formatted: [
                {
                    "task_id": 1,
                    "task": "Create a static table with sample rows",
                    "dep": [],
                },
                {
                    "task_id": 2,
                    "task": "When clicking a row, a modal should open up.",
                    "dep": [],
                }
            ]
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for cleanup_plan", res)
    cleaned_plan = res
    try:
        cleaned_plan_json = json.loads(cleaned_plan)
        return cleaned_plan_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_plan(plan)
