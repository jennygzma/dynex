# This file handles brainstorming the design hypothesis and creating the task list.
import json

from globals import TASK_MAP_FILE_NAME, call_llm
from utils import read_file

app_rules = """
Here are the rules that the application must follow.
- The entire app will be in one index.html file. It will be written entirely in HTML, Javascript, and CSS.
- The application is a UI app. Do not recommend a mobile app. The app cannot suggest any carousels, since it is a UI. For example, if the prompt suggests a swiping interface, in the UI the "swipe" would be done by clicking, since it is not a mobile interface.
- The entire app will be written using React and MUI.
- The app cannot use MaterialUI Icon, Material UI Lab, and other packages that are not available via the CDN.
- Only use GPT, chart.js, gojs, or placeholder data if it was recommended as a dependency.
- Do not design applications that require multimedia such as videos, audio, image-based, or drag and drop.
- The design should not incorporate routes. Everything should exist within one page. No need for design mockups, wireframes, or external dependencies.
- Keep in mind that we do not have the capacity to build a super fancy application. KEEP THE APPLICATION IN SCOPE TO THE USER PROBLEM AND THEORY AS MUCH AS POSSIBLE BECAUSE THERE IS LIMITED CODE WE CAN WRITE. For example, if this is the prompt: "Create a web UI based on this idea: learn chinese, for users: Retired person seeking a mentally stimulating hobby and a way to connect with their cultural heritage, where the application goal is: To gain conversational fluency to communicate with family members and explore ancestral roots. Use the theory of Spaced Repetition (Reviewing information at optimal intervals reinforces memory and aids long-term retention of the language.), which with interaction pattern Interactive storytelling (A narrative-driven approach with dialogues and scenarios, reinforcing vocabulary and phrases through an engaging story with spaced repetition of key elements.) to guide the design.", we should focus on implementing the spaced repetition part - unnecessary features like a social community feature, or working with multiple different stories is overly complex, as is is multiple decks, a setting bar, a profile page.
- Additionally, we are attempting to test the application created, so features that are needed to test the application can be added. For example, if implementing a flashcard learning application that utilizes spaced repetition, one feature to add into the design and plan is a faked date input to allow us to test spaced repetition over time - such as creating an input where the user can type in what day they are on in using the app to test it out. Or, if the app built is a mood tracker, to test it, we also need to see it over time, so the user should be able to type in what day they are, etc. This should depend on what theory is enacted and how we can test it - do not just blindly add fake dates to increment dates.
"""

design_hypothesis_example = """
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


def create_design_hypothesis(problem, matrix):
    hypothesis = f"Create a UI for this {problem}."

    if matrix.get("PersonXIdea"):
        hypothesis += f"\nIt is for {matrix['PersonXIdea']}."
        if matrix.get("PersonXGrounding"):
            hypothesis += f" For more details: {matrix['PersonXGrounding']}"

    if matrix.get("ApproachXIdea"):
        hypothesis += f"\nThe approach should be: {matrix['ApproachXIdea']}."
        if matrix.get("ApproachXGrounding"):
            hypothesis += f" For more details: {matrix['ApproachXGrounding']}"

    if matrix.get("InteractionXIdea"):
        hypothesis += f"\nThe interaction paradigm shown in the interface should be {matrix['InteractionXIdea']}."
        if matrix.get("InteractionXGrounding"):
            hypothesis += f" For more details: {matrix['InteractionXGrounding']}"

    return hypothesis.strip()


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


def get_tools_requirement_context(tools_requirements):
    paragraph = ""
    for key, value in tools_requirements.items():
        required = "required" if value["required"] == "yes" else "not required"
        paragraph += f"The {key} is {required} because {value['why']}. "
    return paragraph.strip()


def get_design_hypothesis(ui_prompt, faked_data, tools_requirements_context):
    print("calling LLM for get_design_hypothesis...")
    user_message = f"""
        This is the UI prompt: {ui_prompt}
        This is the faked_data: {faked_data}
    """
    system_message = f"""
                You are a UI designer who wants to create the best UI suitable for the application the user wants, given the data model the user wants to visualize. {app_rules}
				Each design should detail the application layout, user interactions, and consider all inputs and logic that the app will use.
                The app will use these dependencies: {tools_requirements_context}. If any of the dependencies are not used, DO NOT USE THEM. MAKE SURE NOT TO USE THEM. If they are used, MAKE SURE TO INCLDUE IT IN THE DESIGN.
                It should be less than 300 words, and each sentence should be a bullet point.
                {design_hypothesis_example}
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for get_design_hypothesis", res)
    return res


def get_tool_requirements(ui_prompt):
    user_message = f"""
        This is the prompt: {ui_prompt}
    """
    system_message = """
                You are a UI developer advising a designer on the tools that need to be used to implement the UI design.
                Given a prompt for a UI design, you are to decide if the tool is to be used or not and respond using a JSON.
                The tools available are GPT, Generated Images, Faked_Data, ChartJS, and GoJS
                A description of when to use each follows:
                GPT
                Yes if app requires generation of data based on input, such as:
                - Recommendation app based on user input.
                - News app that shows recent news updates.
                - Medicine application that provides data based on the user giving a list of symptoms.
                No if the application can rely solely on pre-generated data or simulating an existing dataset, such as:
                - Language-Learning app relying on pre-generated questions
                - Shopping app showing items from a store with a specific stock of items.
                - Article application that displays already existing information to the user that does not need to be changed.
                Images with GPT
                Yes if application requires images such as:
                - app that needs visuals like outfit swiping.
                - app that displays products for shopping based on user’s requirements,
                - apps that show food for cooking based on the user's allergies and likes.
                No if app does not implement images such as:
                - App has a text-based quiz.
                - App that stores notes from user.
                - App that recommends instructions to the user, relying purely on text.
                Faked Data
                Yes if application can rely solely on pre-generated data or simulating an existing dataset:
                - Learning application that displays information already made.
                - Application that quizzes the user based on pre-made questions
                - Application that shows information that does not need to be constantly updated.
                No if the application needs to create new data based on user input.
                - An application that creates a list of items based on user input.
                - An application that gives advice on a subject based on data.
                - An application that changes the information it uses based on user interaction.
                ChartJS
                Yes if the application uses chart-based visuals.
                - An application that tracks trends over time using graphs.
                - An application that compares values of two things uses charts.
                - An application that
                No if the application has no need of chart visuals.
                - A purely text-based application.
                - An application that uses images.
                - Application that uses text and images but no charts.
                GoJS
                Yes if the application uses Diagram or node-based display.
                - The application displays a diagram to the user.
                - The application displays a hierarchical system to the user.
                - The application has an interactable node-based diagram.
                Not if the application has no need of a diagram visual.
                - The application is purely text-based
                - The application has images but they are not diagrams.
                - The application uses text and images but no diagrams.
                This should be stored in a json like:
                {
                “gpt”: {“required”: “yes/no”, “why”: “XYZ”},
                “images”: {“required”: “yes/no”, “why”: “XYZ”},
                “faked_data”: {“required”: “yes/no”, “why”: “XYZ”},
                “chart_js”: {“required”: “yes/no”, “why”: “XYZ”},
                “go_js”: {“required”: “yes/no”, “why”: “XYZ”},
                }
                Below are examples of responses
                Example 1:
                Create a web UI based on this: Outfit RecommendationFor the PersonXIdea section, the input is: Fashion-challenged individual needing style guidance
                For the PersonXGrounding section, the input is: The fashion-challenged individual is often frustrated or overwhelmed by the task of dressing stylishly. They may lack the time, knowledge, or confidence to create outfits that feel modern, fashionable, and appropriate for their needs. They might routinely resort to the same uninspired combinations, feeling dissatisfied but unsure how to improve. The problem is challenging as it's extremely subjective and personal - principles of what is 'fashionable' can vary greatly.
                For the ApproachXIdea section, the input is: LLM aided recommendation system based on user input
                For the ApproachXGrounding section, the input is: The user should begin by completing a personal style profile, providing basic information like age, body type, and style preferences. They could also describe the types of events or situations they typically need to dress for (work, going out, casual weekends, etc.). Then the LLM-guided system could suggest outfits based on these inputs and learns and refines its recommendations over time based on feedback about each outfit.
                For the InteractionXIdea section, the input is: Interactive Virtual Closet layout
                For the InteractionXGrounding section, the input is: The virtual closet should divide items into sections like tops, bottoms, shoes, accessories for easy selection. Each item should be displayed with a clear photo, name, and basic details like color, style, and category. The layout should be intuitive and engaging. By clicking on the item, the user could see it paired with recommended items to create a potential outfit.
                {
                “gpt”: {“required”: “yes”, “why”: “The application needs to recommend clothing to the user based on the input they gave. The application should use the gpt hook to generated these recommendations”},
                “images”: {“required”: “yes”, “why”: “The items displayed to the user are accompanied by an image. The application should use the image gpt hook to create these images.”},
                “faked_data”: {“required”: “no”, “why”: “The system will use the gpt hook to create the recommendations, so the faked data is unnecessary.”},
                “chart_js”: {“required”: “no”, “why”: “The application uses does not require any charts or graphs. ”},
                “go_js”: {“required”: “no”, “why”: “The application does not use any diagrams.”},
                }
                Example 2:
                Create a web UI based on this: Want to learn spanishFor the PersonXIdea section, the input is: Young language enthusiast wishing to become bilingual
                For the PersonXGrounding section, the input is: - The user aims to learn Spanish to enhance communication capabilities, engage with varied cultures, and boost cognitive skills.
                - The existing language learning sources may be time-consuming, lack interactivity, and fail to provide real-time feedback or individual attention.
                - The challenge is to provide an engaging, convenient and personalized way to learn Spanish that fits into the user's daily routine and keeps them motivated.
                For the ApproachXIdea section, the input is: Spaced repetition for vocabulary enhancement
                For the ApproachXGrounding section, the input is: - The application should include a Spaced Repetition System (SRS) that schedules the review of words based on user's performance.
                - Challenging words are repeated more frequently, while easier ones are introduced less often.
                - The interface should provide users with instant feedback, correcting errors and offering pronunciation aids.
                - To maintain interest and motivation, incorporate a scoring system, where users earn points for correct answers and lose points for errors.
                For the InteractionXIdea section, the input is: Interactive Flashcards
                For the InteractionXGrounding section, the input is: - For each flashcard, one side should display a word or phrase in English, while the other side should display the corresponding Spanish translation.
                - Feedback (correct/incorrect) for the translations filled by the user should be provided instantly.
                - A progress bar should be displayed to indicate the user's overall progress through the flashcards deck.
                - Users should have the option to flag difficult cards for further practice.
                {
                “gpt”: {“required”: “no”, “why”: “The application uses flashcards which can be pre-defined. ”},
                “images”: {“required”: “no”, “why”: “The application does not require images..”},
                “faked_data”: {“required”: “yes”, “why”: “The application requires pre-generated text to create the flashcards.”},
                “chart_js”: {“required”: “no”, “why”: “The application does not need a charts or graphs.”},
                “go_js”: {“required”: “no”, “why”: “The application does not need diagrams.”},
                }
                Example 3:
                Create a web UI based on this: A workout application that charts your routines For the PersonXIdea section, the input is: Regular gym-goer looking to track workouts
                For the PersonXGrounding section, the input is: - The user aims to meticulously track their workout routines, noting down exercises, repetitions, sets, and weights.
                - They face difficulty remembering these details, which results in inconsistent progression.
                - Existing solutions might lack a clean and effective way of documenting this information.
                - There's a need for an application that can easily log workouts, analyze performance over time and suggest improvements.
                For the ApproachXIdea section, the input is: User-customizable database for workout logging with charts
                For the ApproachXGrounding section, the input is: - Users should be able to log information detailing their exercises (name of exercise, sets, reps, weights used), and also note any additional exercise-specific nuances (speed, breaks between sets, difficulty).
                - The database should be customizable, allowing users to add or remove types of exercises, change their exercise plan, and set exercise goals.
                - There should be progress charts that visually depict a user's growth over time in a specific exercise, focusing on parameters like increase in weights lifted, more reps, or longer sessions.
                - The app could include features to analyze patterns, predict personal records or generate reports of strengths and weaknesses.
                For the InteractionXIdea section, the input is: Data visualization layout for progress charts
                For the InteractionXGrounding section, the input is: - The UI should prominently display progress charts showcasing the user's progress for each logged workout, potentially including weight increase, reps increase, and session length.
                - The UI should provide options for users to input details from their workout easily, like exercise names, sets, reps, and weights used.
                - It should allow users to add, remove, or modify exercises in their workout plan.
                - The interface should be clean and intuitive, encouraging a smooth and efficient data entry process.
                - The UI could include a section for generated reports on strengths, weaknesses, and personal records predictions.
                - Each session's details should be editable in case the user needs to make changes or recall certain aspects later.
                {
                “gpt”: {“required”: “no”, “why”: “The application does not require data since it relies on user input.”},
                “images”: {“required”: “no”, “why”: “The application does not require images.”},
                “faked_data”: {“required”: “no”, “why”: “The application does not need to generate data based on input.”},
                “chart_js”: {“required”: “yes”, “why”: “The application relies on charts and graphs in order to display information to the user.”},
                “go_js”: {“required”: “no”, “why”: “The application does not need diagrams.”},
                }
                Example 4:
                Create a web UI based on this: A flowchart based note-taking applicationFor the PersonXIdea section, the input is: Project manager for task planning
                For the PersonXGrounding section, the input is: - The project manager aims to effectively plan, track, and manage tasks within a project or an array of projects.
                - They face challenges of keeping an overview of individual tasks, their status, and interdependencies.
                - Existing note-taking and task management tools may fall short in visually representing and navigating the complex structures and workflows of tasks in projects.
                For the ApproachXIdea section, the input is: Flowchart-based organizational system
                For the ApproachXGrounding section, the input is: - The flowchart-based note-taking system should visually represent tasks, their statuses, and interdependencies in clear, navigable diagrams.
                - Relevant task details, e.g., due dates, priorities, assignees, and their relations should be editable directly on the flowchart.
                - Auto-arrangement options would help users maintain neat diagrams as tasks increase.
                - Features for exporting or sharing the flowchart view for collaborative purposes should be provided.
                - The system should support drill-down capabilities, allowing users to navigate from a high-level view of the project down to detailed views of individual tasks.
                For the InteractionXIdea section, the input is: Interactive Flowchart UI
                For the InteractionXGrounding section, the input is: - The interactive flowchart should feature nodes representing individual tasks, with details such as title, due date, priority, and assignee visible on hover or click.
                - Nodes should be connected with lines indicating task dependencies allowing visual cues about the task sequence.
                - User interactions might include dragging and dropping nodes to rearrange, double-click or right click to edit task details, and click on connectors to create or modify dependencies.
                - Buttons for zoom in/out and an export option for sharing should be provided.
                - An overall project status panel showing critical path, total tasks, and progress can form an essential part of the UI.
                {
                “gpt”: {“required”: “no”, “why”: “The application does not require data since it relies on user input.”},
                “images”: {“required”: “no”, “why”: “The application does not require images.”},
                “faked_data”: {“required”: “no”, “why”: “The application does not need to generate data based on input.”},
                “chart_js”: {“required”: “no”, “why”: “The application does not require charts..”},
                “go_js”: {“required”: “no”, “why”: “The application uses a node-based flowchart system which can be created through a GoJS diagram.”},
                }
}
            Generally, a rule of thumb is if GPT is not used to retrieve data, then we should generated faked_data.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for get_tool_requirements", res)
    print("--------------------------------------------------------------\n\n\n")
    return cleanup_tools_requirement(res)


def cleanup_tools_requirement(tools_requirement):
    print("calling LLM for cleanup_tools_requirement...")
    user_message = f"Please clean up the tools_requirement so it only returns the json. This is the tools_requirement: {tools_requirement}"
    system_message = """You are an assistant to clean up GPT responses into a json array.
			The response should be as formatted: {
                “gpt”: {“required”: “no”, “why”: “The application does not require data since it relies on user input.”},
                “images”: {“required”: “no”, “why”: “The application does not require images.”},
                “faked_data”: {“required”: “no”, “why”: “The application does not need to generate data based on input.”},
                “chart_js”: {“required”: “no”, “why”: “The application does not require charts..”},
                “go_js”: {“required”: “no”, “why”: “The application uses a node-based flowchart system which can be created through a GoJS diagram.”},
                }
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for cleanup_tools_requirement", res)
    cleaned = res
    try:
        json.loads(cleaned)
        return cleaned
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return cleanup_tools_requirement(tools_requirement)


def get_plan_message(tools_requirements):
    message = f"""
    Give me a vague implementation plan that is feature-based. Each step should focus on implementing a couple interaction/features. {app_rules}
    - Do not use any other dependencies unless specified.
    - No need to have steps to create placeholder data, as that will be created externally and we will have an endpoint that calls for it.
    - The first step should focus on creating the general structure of the app.
    Here is an example of a plan, given a design hypothesis: {plan_example}

    """
    if tools_requirements is None or tools_requirements == {}:
        message += "Limit the plan to 1-3 steps. If it's possible to create in one step, you can recommend that."
    if (
        tools_requirements["gpt"]["required"] == "yes"
        and tools_requirements["images"]["required"] == "yes"
    ):
        message += f"""
            Limit the plan to 3-5 steps.
            Dedicate a step to the creation of the gpt process that will allow the application to generate data and images. {tools_requirements["images"]["why"]}
            When calling GPT, ensure there is a button (for example: a submit, or a get recommendations button) that calls GPT to prevent calling GPT continuously. Also, have the button show if the GPT API is loading or not (after clicking, can have the button say "Loading")
        """
    elif tools_requirements["gpt"]["required"] == "yes":
        message += """
            Limit the plan to 3-5 steps.
            Dedicate a step to the creation of the gpt process that will allow the application to generate data.
            When calling GPT, ensure there is a button (for example: a submit, or a get recommendations button) that calls GPT to prevent calling GPT continuously. Also, have the button show if the GPT API is loading or not (after clicking, can have the button say "Loading")
        """
    elif tools_requirements["images"]["required"] == "yes":
        message += f"""
            Limit the plan to 3-5 steps.
            ONE STEP MUST BE DEDICATED TO GRABBING IMAGES FROM GPT.
            MAKE SURE TO DEDICATE A STEP TO GRAB IMAGES FROM GPT, and have logic to the creation of the gpt process that will allow the application to generate images and add it to the relevant places in the UI deemed necessary.
            {tools_requirements["images"]["why"]}
            When calling GPT for images, only call GPT once to populate the images.
        """
    if tools_requirements["faked_data"]["required"] == "yes":
        message += """
            In the first step of the app, also call the placeholder data from the endpoint.
            Limit the plan to 1-3 steps. If it's possible to create the application in 1-2 steps, do that.
        """
    if tools_requirements["chart_js"]["required"] == "yes":
        message += """
            Limit the plan to 2-4 steps.
            Dedicate a step integrate the dependencies of chart_js.
        """
    if tools_requirements["go_js"]["required"] == "yes":
        message += """
            Limit the plan to 2-4 steps.
            Dedicate a step integrate the dependencies of go_js.
        """
    if (
        tools_requirements["gpt"]["required"] != "yes"
        and tools_requirements["images"]["required"] != "yes"
        and tools_requirements["faked_data"]["required"] != "yes"
        and tools_requirements["chart_js"]["required"] != "yes"
        and tools_requirements["go_js"]["required"] != "yes"
    ):
        message += """Limit the plan to 1-2 steps. DO NOT RECOMMEND ANY OTHER PACKAGES THAT WERE NOT ALREADY SPECIFIED."""
    return message


def get_plan(design_hypothesis, tools_requirements):
    print("calling LLM for get_plan...")
    message = get_plan_message(tools_requirements)
    system_message = f"""
        You are a helpful senior software engineer building a plan to implement a UI based on a design hypothesis.
        {message}
        Only include placeholder data, GPT calls, ChartJS, or GoJS if specified. NOT ALL APPS USE PLACEHOLDER DATA.
        Format it like this: [{{"task_id: task_id, "task": task, "dep": dependency_task_ids}}].
		The "dep" field denotes the id of the previous tasks which generates a new resource upon which the current task relies.
		"""
    user_message = f"Create a plan for this design hypothesis: {design_hypothesis}."
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
