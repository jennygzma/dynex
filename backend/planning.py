# This file handles brainstorming the design hypothesis and creating the task list.
import json

from globals import TASK_MAP_FILE_NAME, call_llm
from utils import read_file

app_rules = """
Here are the rules that the application must follow.
- The entire app will be in one index.html file. It will be written entirely in HTML, Javascript, and CSS.
- The application is a UI app. Do not recommend a mobile app. For example, if the prompt suggests a swiping interface, in the UI the "swipe" would be done by clicking, since it is not a mobile interface.
- The entire app will be written using React and MUI.
- The app can also call GPT, use ChartJS, and GoJS. For example, if the application suggests using an ML algorithm for a personalization or suggestion-type application, the design should recommend using GPT as an LLM to accomplish this.
- The app cannot use MaterialUI Icon, Material UI Lab, and other packages that are not available via the CDN.
- However, if not necessary, do not call ChartJS, GoJS, or GPT. Only call these packages if absolutely necessary, as we don't want to overcomplicate the application.
- Do not design applications that require multimedia such as videos, audio, image-based, or drag and drop.
- The design should not incorporate routes. Everything should exist within one page. No need for design mockups, wireframes, or external dependencies.
- Keep in mind that we do not have the capacity to build a super fancy application. KEEP THE APPLICATION IN SCOPE TO THE USER PROBLEM AND THEORY AS MUCH AS POSSIBLE BECAUSE THERE IS LIMITED CODE WE CAN WRITE. For example, if this is the prompt: "Create a web UI based on this idea: learn chinese, for users: Retired person seeking a mentally stimulating hobby and a way to connect with their cultural heritage, where the application goal is: To gain conversational fluency to communicate with family members and explore ancestral roots. Use the theory of Spaced Repetition (Reviewing information at optimal intervals reinforces memory and aids long-term retention of the language.), which with interaction pattern Interactive storytelling (A narrative-driven approach with dialogues and scenarios, reinforcing vocabulary and phrases through an engaging story with spaced repetition of key elements.) to guide the design.", we should focus on implementing the spaced repetition part - unnecessary features like a social community feature, or working with multiple different stories is overly complex, as is is multiple decks, a setting bar, a profile page.
- Additionally, keep in mind that we are attempting to test the application created. If necessary, factor into the planning tasks that will allow us to test spaced repetition over time - such as creating an input where the user can type in what day they are on in using the app to test it out. Or, if the app built is a mood tracker, to test it, we also need to see it over time, so the user should be able to type in what day they are, etc. This should depend on what theory is enacted and how we can test it - do not just blindly add fake dates to increment dates.
"""

design_hyptothesis_example = """
Here is an example of the design hypothesis of a music-recommendation app.
Application Layout:
- Create a clean, simple interface divided into two main sections: "Discover" and "Favorites."
- The "Discover" section would have a large area that changes dynamically to display song details with each swipe (song name, artist, album, genre, and description).
- It would also have 'like', 'dislike' and 'skip' buttons, which will work with simple clicks.
- The 'Favorites' section would be a list of all liked songs.

User Interactions:
- The user can click to swipe a song left (dislike), right (like), or down (skip).
- The user can click on a song to save to favorites once liked.
- The user can navigate between "Discover" and "Favorites" sections via top navigation tabs.

Inputs and Logic:
- The app will use the user's interactions (likes, dislikes, skips) as inputs to an ML model (implemented using GPT) to evolve its music recommendations in real-time.
- On initial use, ask the user for favorite genres, artists, or songs to kickstart the ML algorithm.
- The user's interaction with each song (whether they like, dislike, or skip it) will further tailor the recommendations.
- The saved favorite songs will be stored
- There is no need to create placeholder data for music, as GPT will return the music recommendations.

Here is an example of a design hypothesis of a outfit-generator app.
Application Layout:

- Create a clean, minimalist interface with a prominent central area for displaying outfit recommendations.
- Divide the interface into three main sections: "Outfit Recommendations," "Wardrobe," and "Saved Outfits."
- The "Outfit Recommendations" section should display swipeable cards with visual representations of the recommended outfits, along with relevant tags (season, occasion, style).
- The "Wardrobe" section should allow users to input their clothing items, categorized by type (tops, bottoms, dresses, etc.).
- The "Saved Outfits" section should display a grid of liked outfits for future reference.

User Interactions:

- Users can swipe left by clicking no, or right by clicking yes on the outfit recommendation cards to dislike or like the outfit, respectively.
- Users can click on individual clothing items in the "Wardrobe" section to add or remove them from their virtual wardrobe.
- Users can click on a liked outfit in the "Saved Outfits" section to view its details or remove it from the saved list.

Inputs and Logic:

- The app will use the user's initial wardrobe inputs and style preferences (gathered through a brief questionnaire) to kickstart the GPT-powered outfit recommendation algorithm.
- The algorithm will consider factors like season, occasion, and the user's wardrobe items to generate outfit recommendations.
- The user's interactions (likes, dislikes) with the recommended outfits will be used as feedback to refine and personalize the algorithm's recommendations over time.
- The liked outfits will be saved in the "Saved Outfits" section for future reference.
- Create placeholder data for initial wardrobe.

Here is an example of a design hypothesis for a plant watering system:
Application Layout:

- Create a clean and intuitive interface with a prominent section for the "Watering Calendar."
- Divide the interface into three main sections: "Watering Calendar," "Plant List," and "Watering Reminders."
- The "Watering Calendar" section should display a monthly calendar view with visual indicators for scheduled watering days.
- The "Plant List" section should allow users to add and manage their plant collection, including details like species, pot size, and watering requirements.
- The "Watering Reminders" section should display upcoming watering tasks and allow users to set notification preferences.

User Interactions:

- Users can click on specific dates in the "Watering Calendar" to schedule or modify watering tasks for individual plants or groups.
- Users can click on plants in the "Plant List" to view or edit their details, including watering schedules.
- Users can set notification preferences (email, push notifications, etc.) for upcoming watering tasks in the "Watering Reminders" section.

Inputs and Logic:

- The app will use the user's initial plant inputs (species, pot size, etc.) to determine baseline watering requirements for each plant.
- An algorithm (implemented using GPT) will analyze factors like plant type, pot size, and environmental conditions (temperature, humidity, etc.) to generate adaptive watering schedules.
- The algorithm will learn from the user's interactions (manually adjusting watering schedules, plant health feedback) to refine its recommendations over time.
- The app will send reminders based on the user's scheduled watering tasks and notification preferences.
- Create placeholder data for user's current plants.

"""

plan_example = """
For design hypothesis:
Application Layout:
- Create a clean, minimalist interface with a prominent central area for displaying outfit recommendations.
- Divide the interface into three main sections: "Outfit Recommendations," "Wardrobe," and "Saved Outfits."
- The "Outfit Recommendations" section should display swipeable cards with visual representations of the recommended outfits, along with relevant tags (season, occasion, style).
- The "Wardrobe" section should allow users to input their clothing items, categorized by type (tops, bottoms, dresses, etc.).
- The "Saved Outfits" section should display a grid of liked outfits for future reference.
User Interactions:
- Users can swipe left by clicking no, or right by clicking yes on the outfit recommendation cards to dislike or like the outfit, respectively.
- Users can click on individual clothing items in the "Wardrobe" section to add or remove them from their virtual wardrobe.
- Users can click on a liked outfit in the "Saved Outfits" section to view its details or remove it from the saved list.
Inputs and Logic:
- The app will use the user's initial wardrobe inputs and style preferences (gathered through a brief questionnaire) to kickstart the GPT-powered outfit recommendation algorithm.
- The algorithm will consider factors like season, occasion, and the user's wardrobe items to generate outfit recommendations.
- The user's interactions (likes, dislikes) with the recommended outfits will be used as feedback to refine and personalize the algorithm's recommendations over time.
- The liked outfits will be saved in the "Saved Outfits" section for future reference.
- Create placeholder data for initial wardrobe.

Here is the example plan. It is longer because we are using GPT:
1. Set up the React application and create the main layout with the three sections: 'Outfit Recommendations', 'Wardrobe', and 'Saved Outfits'. Read in the placeholder data from the endpoint.
2. Implement the 'Outfit Recommendations' section with swipeable cards using MUI components. Create placeholder data for initial outfit recommendations.
3. Implement the 'Wardrobe' section with a list of clothing items categorized by type (tops, bottoms, dresses, etc.). Allow users to add or remove items from their virtual wardrobe.
4. Implement the 'Saved Outfits' section with a grid layout to display liked outfits. Allow users to view outfit details or remove outfits from the saved list.
5. Integrate GPT to generate outfit recommendations based on the user's wardrobe and style preferences. Implement the logic to handle user interactions (likes, dislikes) and refine the recommendations accordingly.
"""


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
    system_message = f"""
                You are a UI designer who wants to create the best UI suitable for the application the user wants, given the data model the user wants to visualize. {app_rules}
				Each design should detail the application layout, user interactions, and consider all inputs and logic that the app will use.
                In most cases, the application will require using fake, placeholder data to test out the application. In some cases it will not. If the application requires creating fake, placeholder data, then mention it in the design. Add details about what type of placeholder data should be generated.
                It should be less than 300 words, and each sentence should be a bullet point.
                {design_hyptothesis_example}
                The design hypothesis should decide what type of placeholder data to generate (unless the application truly does not require any placeholder data), and should also decide whether or not GPT, chartJS, or goJS is required.
                If the app would benefit from a visual requirement, you can suggest using GPT to generate images, or use placeholder images.
                Only recommend GPT if it is a personalization or recommender app, or if generated images would significantly enhance the app. Only recommend chartJS or GoJS if ABSOLUTELY NECESSARY. Do not recommend other packages.
                Most applications will need placeholder data of some form, even when not obvious. For example:
                - when creating an outfit personalization app, even though GPT is called for the outfit recommendations, the initial wardrobe can be populated by placeholder data
                - when creating an music recommendation app, if necessary, the initial music library can be created using placeholder data
                - when creating a journaling app based on CBT, the CBT exercises can be created using placeholder data.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for get_design_hypothesis", res)
    return res


def get_plan(design_hypothesis):
    print("calling LLM for get_plan...")
    user_message = f"""
        Give me a vague implementation plan that is feature-based. Each step should focus on implementing a couple interaction/features. {app_rules}
        The first step should focus on creating the general structure of the app. If placeholder data was generated as specified by the design hypothesis, then add that to the step.
        No need to have steps to create placeholder data, as that will be created before this.
        Limit the plan to 1-3 steps. If the application is particularly complex, such as requiring complex GPT calls and logic, then allow two extra steps specifically detailing the logic of calling these external libaries - but only if needed.
        At most, there will be 5 steps.
        Format it like this: [{{"task_id: task_id, "task": task, "dep": dependency_task_ids}}].
		The "dep" field denotes the id of the previous tasks which generates a new resource upon which the current task relies.
		"""
    system_message = f"You are a helpful software engineer to answer questions related to implementing this UI based on this design hypothesis: {design_hypothesis}"
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
