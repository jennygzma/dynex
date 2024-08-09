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
				Each design should detail the user interactions and design layout. IT SHOULD BE LESS THAN 150 WORDS.
                Make sure that the design does not incorporate routes. Everything should exist within one page.
                Make sure the design is consistent with the json data object provided by the user. All data shown must exist as a field on the JSON object.
				Keep in mind that we do not have the capacity to build a super fancy application. Keep the application in scope. For example, if this is the prompt:
                "Create a web UI based on this idea: learn chinese, for users: Retired person seeking a mentally stimulating hobby and a way to connect with their cultural heritage, where the application goal is: To gain conversational fluency to communicate with family members and explore ancestral roots. Use the theory of Spaced Repetition (Reviewing information at optimal intervals reinforces memory and aids long-term retention of the language.), which with interaction pattern Interactive storytelling (A narrative-driven approach with dialogues and scenarios, reinforcing vocabulary and phrases through an engaging story with spaced repetition of key elements.) to guide the design."
                Focus on implementing the spaced repetition part - unnecessary features like a social community feature, or working with multiple different stories is overly complex, as is is multiple decks, a setting bar, a profile page.
                KEEP THE APPLICATION IN SCOPE TO THE USER PROBLEM AND THEORY AS MUCH AS POSSIBLE BECAUSE THERE IS LIMITED CODE WE CAN WRITE.
                DO NOT REQUIRE APPLICATIONS THAT REQUIRE MULTIMEDIA SUCH AS VIDEOS, AUDIO, IMAGE BASED, OR DRAG AND DROP.
                Instead, the scope should be using one traditional chinese narrative to implement spaced repetition. Focus on what the interaction will be - will it be card-swiping, gmail-like, or something else?
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for get_design_hypothesis", res)
    return res


def get_user_examples(idea):
    print("calling LLM for get_user_examples...")
    user_message = f"This is the idea you are brainstorming users for: {idea}."
    system_message = """You are a helpful assistant that helps brainstorm who the target user is given a specific idea.
    For example, if the idea is "learn chinese", some examples of users are "30 year old english-speaking student" or or "busy professional who only has 30 minutes a day to learn chinese"
    If the idea is "journaling app", some examples of users are "someone struggling with depression" or "someone going through a breakup".
    If the idea is "finding a nail salon", some examples are "celebrity assistant" or "female teenager".
    Format the the responses in an array like so: ["30 year old english speaking student", "5 year old native"]
    Only return 3 brainstorms.
    """
    res = "here are the users: " + call_llm(system_message, user_message)
    theories = cleanup_brainstorms_no_descriptions(res)
    print("sucessfully called LLM for get_user_examples", res)
    return theories


def get_goal_examples(idea, user):
    print("calling LLM for get_goal_examples...")
    user_message = (
        f"This is the idea: {idea}, for users : {user}. Brainstorm some goals"
    )
    system_message = """You are a helpful assistant that helps brainstorm goals of an application given an idea and user.
    For example, if the idea is to "learn chinese" for "a 30 year old english-speaking student", some example goals of the application could be "gain vocabulary to travel to China for a week and learn Chinese in 3 weeks", versus "learn grammar".
    If the idea is "finding a nail salon" for "a female teenager", the goal of the application could be to "explore a all the nail salons in NYC to formulate where to go when I visit", or "go to a nail salon ASAP for prom"
    Format the brainstormed goals in an array like so: ["get nails for prom as soon as possible", "explore nail salons in NYC"]
    Only return 3 brainstorms.
    """
    res = "here are the goal examples: " + call_llm(system_message, user_message)
    theories = cleanup_brainstorms_no_descriptions(res)
    print("sucessfully called LLM for get_goal_examples", res)
    return theories


def cleanup_brainstorms_no_descriptions(brainstorms):
    print("calling LLM for cleanup_brainstorms...")
    user_message = f"Please clean up the response so it only returns the array. This is the response: {brainstorms}"
    system_message = """You are an assistant to clean up GPT responses into an array.
			The response should be as formatted: "[
                "a", "b", "c"
            ]"
            Only the string form of the array should be returned. NOTHING OUTSIDE OF THE ARRAY SHOULD BE RETURNED.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for cleanup_brainstorms", res)
    cleaned = res
    try:
        cleaned_json = json.loads(cleaned)
        return cleaned_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_brainstorms_no_descriptions(brainstorms)


def get_theories(idea, user, goal, existing_theories):
    print("calling LLM for get_theories...")
    user_message = f"This is the idea of the application: {idea}. Here is the core user: {user}. Here is the goal of the application {goal}. These are the existing theories: {existing_theories}"
    system_message = """You are a helpful assistant that finds theories relevant to a specific domain given a user specification of an application.
    For example, if the user prompt is "create a UI to help me learn chinese for a 30 year old business professional with the goal of gaining conversational fluency to conduct business meetings in China within a couple weeks",
    you should determine that the relevant theories would be in the "learning" domain, and return theories like spaced repetition, generation and elaboration, culturally relevant education, etc.
    If the task is "finding a nail salon for an beginner to nails with the purpose of getting a sense of the nail salons", the domain would not be nail or beauty related, but would be search or matchmaking or decision-making related.
    Make sure to also add a description as to WHY this theory is suitable for the idea and user. Keep the description under 40 words.
    You also cannot return theories that the user already knows. This will be provided as existing theories.
    Format the theories in an array like so: [{"theory": "spaced repetitition", "description": "This is good for a business professional visiting china because it optimizes review timing and enhacnes memory retention to recall focusing on information just before it is forgotten."},
    {"theory":"generation and elaboration", "description": "Generation and elaboration enhance learning by actively involving the learner, fostering deeper understanding and stronger memory connections through self-produced content and detailed explanations."}]
    Only return 3 theories.
    """
    res = "here are the theories: " + call_llm(system_message, user_message)
    theories = cleanup_brainstorms_with_descriptions(res)
    print("sucessfully called LLM for get_theories", res)
    return theories


def get_ui_paradigms(idea, user, goal, theory, existing_paradigms):
    print("calling LLM for get_paradigms...")
    user_message = f"This is the idea of the application: {idea}. Here is the core user: {user}. Here is the goal of the application {goal}. Here is the relevant theory: {theory}. Here are the existing paradigms: {existing_paradigms}"
    system_message = """You are a helpful assistant that finds UI paradigms, including interactions and layouts of the UI, relevant to a specific domain given a user specification of an application.
    For example, if the user prompt is "create a UI to help me learn chinese for a 30 year old business professional with the goal of gaining conversational fluency to conduct business meetings in China within a couple weeks using the theory of spaced repetition",
    you could use flashcards and indicating whether or not the user got it right or wrong, and keep showing wrong cards, to enact spaced repetition algorithm.
    Or, you could create a quiz UI, and everytime the answer is wrong, the spaced repetition algorithm will bring back the wrong quiz questions.
    Please keep your descriptions under 40 words, but be elaborate in how you would actualize the theory given the use case. HOW WOULD YOU ACTUALIZE THE THEORY IN THIS SITUATION? RETURN UI PARADIGMS THAT WOULD HELP ACTUALIZE THIS THEORY GIVEN THE GOAL, USER, AND IDEA.
    However, keep the UI paradigm in scope. For example, if the theory is spaced repetition, there is NO NEED to have a "community section", or to "Create personalized flashcard decks" or a "settings" or "profile" component.
    Keep in mind that we do not have the capacity to build a super fancy application. Keep the application in scope to the user problem and theory as much as possible.
    DO NOT REQUIRE APPLICATIONS THAT REQUIRE MULTIMEDIA SUCH AS VIDEOS, AUDIO, IMAGE BASED, OR DRAG AND DROP.
    You also cannot return paradigms that the user already knows. This will be provided as existing paradigms.
    Format the paradigms in an array like so: [{"paradigm": "flashcards with card swipe interface", "description: "flashcards with spaced repetition applied when the answer is right or wrong"},
    {"paradigm": "quiz with gmail-like interface", "description": "quiz with spaced repeition applied when the answer is right or wrong"}]
    Only return 3 paradigms.
    """
    res = "here are the paradigms: " + call_llm(system_message, user_message)
    theories = cleanup_brainstorms_with_descriptions(res)
    print("sucessfully called LLM for get_paradigms", res)
    return theories


def cleanup_brainstorms_with_descriptions(brainstorms):
    print("calling LLM for cleanup_brainstorms...")
    user_message = f"Please clean up the response so it only returns the array. This is the response: {brainstorms}"
    system_message = """You are an assistant to clean up GPT responses into an array. It will either be an array of theories and their descriptions or an array of paradigms and their descriptions.
			The response should be as formatted: "[
                {"theory or paradigm": "a", "description": "x" }, {"theory or paradigm": "b", "description": "x" }
            ]"
            Only the string form of the array should be returned. NOTHING OUTSIDE OF THE ARRAY SHOULD BE RETURNED.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for cleanup_brainstorms", res)
    cleaned = res
    try:
        cleaned_json = json.loads(cleaned)
        return cleaned_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_brainstorms_with_descriptions(brainstorms)


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
        Additionally, keep in mind that we are attempting to test the application created. So, if the application for example implements spaced repetition that has different algorithms each day,
        If necessary, factor into the planning tasks that will allow us to test spaced repetition over time - such as creating an input where the user can type in what day they are on in
        using the app to test it out. Or, if the app built is a mood tracker, to test it, we also need to see it over time, so the user should be able to type in what day they are, etc. This should depend on what theory is enacted and how we can test it - do not just blindly add fake dates to increment dates.
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
