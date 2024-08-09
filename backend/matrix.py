# This file handles brainstorming the design hypothesis and creating the task list.
import json

from globals import call_llm

PPAI_DESCRIPTION = """When we create a UI based on a particular problem, we define it with a 3x2 problem matrix.
First, we problem further into 3 categories: Person, Approach, and Interaction Paradigm.
Within each category, there are 2 more sub-categories: idea and grounding."""

CATEGORY_DESCRIPTIONS = {
    "PersonXIdea": "Within the person section, the idea subsection identifies who the application is for. It defines the target user group or demographic. Are you designing the app for students, professionals, children, elderly people, people with specific needs or conditions, etc.?",
    "PersonXGrounding": "Within the person section and the grounding subsection, we dig deeper into understanding the user's goals and context. Specifically: What does the user aim to achieve with this app? What specific problem does the user have? Why is this problem difficult to solve? Why are existing solutions inadequate? What gaps or shortcomings do they have that your application will address?",
    "ApproachXIdea": "Within the approach section and the idea subsection we think about how we conceptualize the method or strategy to tackle the identified problem. What kind of approach will you use to solve the user's problem? Are you using an algorithm, an existing theory, workflow, or innovative process?",
    "ApproachXGrounding": "Within the approach section and the grounding subsection, we focus on the tangible details of making the approach feasible and effective for the target users. What are the essential components and features required to implement the approach effectively? How will you bring this approach to life?",
    "InteractionXIdea": "Within the interaction section and the idea subsection we contemplate the general design of the user interface. How should the UI look and what interactions should the user have with it? Consider how the design aligns with the users' needs and expectations.",
    "InteractionXGrounding": "Within the interaction section and the grounding subsection, we delve into the specifics of the UI components and user interactions: What general information will be shown in each UI component? What kinds of interactions will the user have with the UI? For example, will there be buttons to click, swipes, drag-and-drop features, form fields?",
}

PPAI_EXAMPLES = """
Here are some examples:

OKCupid -
PersonXIdea: Someone looking to date.
PersonXGrounding: It is hard to search for people to date that are compatible and match what you want.
ApproachXIdea: Searchable Database - allow people to search for what they want.
ApproachXGrounding: The attributes that users should be able to search for include Age, Ethnicity, Religion, Preferences (e.g., interests, lifestyle choices, relationship goals). These criteria help users narrow down potential matches to those who align with their personal values, beliefs, and desires.
InteractionXIdea: Faceted Browsing
InteractionXGrounding: The facets that should be available include Age, Ethnicity, Religion, Interests, Relationship Goals, Location, and possibly more detailed preferences like education level, political views, or hobbies. These facets allow users to customize their search results by applying multiple filters, making the browsing experience more relevant and efficient.

Tinder:
PersonXIdea: Someone looking to hookup or date.
PersonXGrounding: It is hard to search for people to date because it's hard to know what to search. Also, you don't know what they look like.
ApproachXIdea: Lower the cognitive load - have less information to allow people to make lots of easy judgements
ApproachXGrounding: The select bits of information that should be shown include the user's photo (primary focus), first name, age, and a brief bio or tagline. Optional details like distance or mutual interests can also be included, but the goal is to keep the information minimal to facilitate fast decision-making.
InteractionXIdea: Card Swipe
InteractionXGrounding: Each card should prominently feature the user's photo, taking up most of the card space. Below or alongside the photo, the card should display the user's first name, age, and a brief bio or tagline. Additional icons or indicators for mutual interests, distance, or other relevant details can be shown in a subtle manner. The layout should be clean and focused, ensuring that users can make quick judgments based primarily on the visual appeal and a few key details.

Coffee Meets Bagel:
PersonXIdea: Someone looking for a more serious relationship.
PersonXGrounding: Searching or swiping through a lot of matches is difficult and not intentional.
ApproachXIdea: Lower the cognitive load by having less matches to make more intentional judgements
ApproachXGrounding: Matches should be selected based on compatibility factors such as shared values, relationship goals, and lifestyle preferences. The algorithm should prioritize quality over quantity, focusing on users with a higher likelihood of a meaningful connection. The information shown should include the user’s photo, name, age, a well-thought-out bio, key interests or hobbies, and a brief summary of relationship preferences or goals. This curated approach ensures that each match is more likely to be relevant and meaningful.
InteractionXIdea: Feed view with 5 matches to read
InteractionXGrounding: : Each "post" in the feed should feature a user’s photo as the focal point, followed by their name and age. The post should also include a concise bio that highlights their personality, interests, and what they’re looking for in a relationship. Additionally, it could show a few shared interests or mutual connections, along with a brief summary of why the match was selected. The layout should encourage thoughtful consideration, presenting just enough information to pique interest without overwhelming the user.
"""

APPROACH_EXAMPLES = """Approaches focus more on what ideas should be implemented as the core logic (backend) of the application based on person context on what the problem is.
It could be a theory within a domain the app will be built in like spaced repetition for learning apps, subjective expected utility for recommendation or search apps, CBT or ACT for mental health apps, gamification, or CLT for decisionmaking.
It could be an app solution, such as a rules-based system, Uber for X (airBnb is uber for homes), marketplace system, workflow system, database (logging or reading), social network
"""

INTERACTION_EXAMPLES = """The Interaction focuses on the UI Paradigm in the front end, such as the layout and interactoin paradigms.
Examples include chatbot (messaging), cardswipe (tinder), feed (facebook, tiktok, twitter, news), faceted browsing, carousel, table (gmail).
Approaches generally have a simple basic for UI which people gravitate towards (a searchable database can easily have a table-like UI, but pairing approaches with non-obvious UIs is interesting)
"""

MATRIX_DESCRIPTION = f"{PPAI_DESCRIPTION} + {" ".join(CATEGORY_DESCRIPTIONS.values())}"

def get_context_from_other_inputs(problem, category, matrix):
    compiled_text = problem
    for key, value in matrix.items():
        if key == category:
            continue
        if not value:
            compiled_text += f"There is no input for the {key} section.\n"
        else:
            compiled_text += f"For the {key} section, the input is: {value}\n"
    return compiled_text

def categorize_problem(problem):
    print("calling LLM for categorize_problem...")
    system_message = f"""You are a system that helps categorize a problem that a user wants to convert to a UI applciation into different specification categories.
    The problem can have varying levels of specificity. {MATRIX_DESCRIPTION}
    For example, if my problem was "learn japanese to watch anime through flashcards", the “Person Idea” would be "me, a 25 year old girl who doesn't have japanese background", the “Person Grounding” would be "to watch anime" but could use more specification, and “Approach Idea” would be "flashcards", and “Approach Grounding”, “Interaction Paradigm Idea” and “Interaction Paradigm Grounding” would all not have context from the problem.
    Given a problem with different levels of complexity, categorize what of the problem is described in the 6 categories provided: Person Idea, Person Grounding, Approach Idea, Approach Grounding, Interaction Paradigm Idea, Interaction Paradigm Grounding. If the category has no answer based on the problem, leave it empty.
    Format the repsonse like this: {{
        "PersonXIdea": "Me",
        "PersonXGrounding": "To watch anime",
        "ApproachXIdea": "Flashcards",
        "ApproachXGrounding": "",
        "InteractionXIdea": "",
        "InteractionXGrounding": "",
    }}
    """
    user_message = f"This is the user problem: {problem}"
    res = call_llm(system_message, user_message)
    matrix = clean_categorization(f"response: {res}")
    print("sucessfully called LLM for categorize_problem", res)
    return matrix


def clean_categorization(response):
    print("calling LLM for clean_categorization...")
    user_message = f"Please clean up the response so it only returns the stringified json object. This is the response: {response}"
    system_message = """You are an assistant to clean up GPT responses into a json object.
			The response should be as formatted: "{
        "PersonXIdea": "Me",
        "PersonXGrounding": "To watch anime",
        "ApproachXIdea": "Flashcards",
        "ApproachXGrounding": "",
        "InteractionXIdea": "",
        "InteractionXGrounding": "",
    }"
            Only the jsonobject should be returned. NOTHING OUTSIDE OF THE JSON OBJECT SHOULD BE RETURNED.
            """
    res = call_llm(system_message, user_message)
    print("sucessfully called LLM for clean_categorization", res)
    cleaned = res
    try:
        cleaned_json = json.loads(cleaned)
        return cleaned_json
    except json.JSONDecodeError:
        print("Error decoding JSON, retrying...")
        return clean_categorization(response)

def get_needs_specification(category, input):
    print("calling LLM for get_needs_specification...")
    system_message = f"""You are a system that helps determine if a section needs specification in order to help a user convert it to a UI applciation.
    The problem can have varying levels of specificity. {MATRIX_DESCRIPTION}
    For the given category, determine whether or not the user needs to add more specification based on the current level of specification for the category.
    If the current input is empty, then the given category definitely needs more specification.
    Ensure that for the category, there is a clearly defined answer that does not go in multiple directions. The system should detect if the answer is too broad.
    If the problem specified has too many dimensions, then the categories would need to narrow down the specification.
    For example, if the problem says "learn japanese with flashcards and stories to learn more anime", then the “Approach Idea” category should try to narrow down the approach to either "flashcards" or "stories".
    If the prompt was "learn japanese to read and write to watch anime", then the "Person Grounding" category should narrow down the true problem goal, whether it is to "read japanese" or "write japanese" to watch anime.
    If the problem needs specification, please return "needs specification". If not, return "no specification needed". DO NOT RETURN ANYTHING ELSE.
    ENSURE THAT THE RETURNED RESPONSE IS EITHER "needs specification" or "no specification needed".
    """
    user_message = f"This is the input: {input} for category: {category}"
    res = call_llm(system_message, user_message)
    needs_specification = True if res=="needs specification" else False
    print("sucessfully called LLM for get_needs_specification", res)
    return needs_specification

def brainstorm_inputs(category, context):
    print("calling LLM for brainstorm_inputs...")
    user_message = f"This is the category you are brainstorming for: {category}."
    system_message = f"""You are a helpful assistant that helps brainstorm specification answers for a category to narrow down inputs. {MATRIX_DESCRIPTION} {APPROACH_EXAMPLES} {INTERACTION_EXAMPLES}
    {PPAI_EXAMPLES}
    Here is the context for this problem: {context}
    For the Idea categories (PersonXIdea, ApproachXIdea, InteractionXIdea), the answers SHOULD BE LESS THAN 15 WORDS.
    For the Grounding Categories (PersonXGrounding, ApproachXGrounding, InteractionXGrounding), the answers SHOULD BE LESS THAN 50 WORDS
    Format the the responses in an array like so: ["30 year old english speaking student", "5 year old native"]
    Only return 3 brainstorms.
    """
    res = "here are the users: " + call_llm(system_message, user_message)
    brainstorms = cleanup_array(res)
    print("sucessfully called LLM for brainstorm_inputs", res)
    return brainstorms

def brainstorm_questions(category, input, context):
    print("calling LLM for brainstorm_questions...")
    user_message = f"This is the category you are brainstorming for: {category}. This is the current input for the category: {input}"
    system_message = f"""You are a helpful assistant that helps brainstorms questions for a category. {MATRIX_DESCRIPTION}
        The goal is to brainstorm questinos tailored for the current category, given the user context provided from the other cateogires and the current input of the category.
        Here is the context: {context}.
        Generate questions that would best help fill out this category based on the existing context.
        For example, if the problem is "learn japanese" and the PersonXIdea section's input is "me", the PersonXIdea could have sample questions like "Is this a beginner or advanced Japanese speaker? Is it for a specific age group or demographic?"
        Or, if the problem is "learn chinese" and in the context, PersonXIdea section's input is "for a retiree who plans on visiting Japan in 3 weeks", the PersonXGrounding section's generated questions could be "What type of Japanese words should be taught? Why do current approaches to learn Japanese in 3 weeks for travelling not work?"
        Format the the responses in an array like so: ["Should the approach be flashcard, or quiz format?", "Are there theories to support learning Japanese"]
    Only return 3 brainstormed questions for this category.
    """
    res = "here are the questions: " + call_llm(system_message, user_message)
    theories = cleanup_array(res)
    print("sucessfully called LLM for brainstorm_questions", res)
    return theories


def brainstorm_answers(category, question, context):
    print("calling LLM for brainstorm_answers...")
    user_message = (
        f"This is for the category {category}. This is the question {question}. Brainstorm some answers"
    )
    system_message = f"""You are a helpful assistant that helps brainstorm answers for a question in a given category. {MATRIX_DESCRIPTION}
    Here is the user context for the overall problem: {context}
    For example, if the problem is "learn chinese" and the question is for PersonXIdea and is  "Who is the application for?" some brainstormed examples could be are "30 year old english-speaking student" or or "busy professional who only has 30 minutes a day to learn chinese"
    If the problem is "journaling app"and the question is for PersonXIdea and is "Who is the application for?" some brainstormed examples are "someone struggling with depression" or "someone going through a breakup".
    For example, if the problem is to "learn chinese" and the PersonXIdea section is "a 30 year old english-speaking student", some example answers for PersonXGrounding question of "What is the goal of the applciation?" of the application could be "gain vocabulary to travel to China for a week and learn Chinese in 3 weeks", versus "learn grammar".
    If the problem is "finding a nail salon" and the PersonXIdea section "a female teenager", some example answers for the PersonXGrounding queston of "What is the goal of the applciation?" could be to "explore a all the nail salons in NYC to formulate where to go when I visit", or "go to a nail salon ASAP for prom"
    Format the brainstormed goals in an array like so: ["get nails for prom as soon as possible", "explore nail salons in NYC"]
    Only return 3 brainstormed answers.
    """
    res = "here are the brainstoremd answers: " + call_llm(system_message, user_message)
    theories = cleanup_array(res)
    print("sucessfully called LLM for brainstorm_answers", res)
    return theories


def cleanup_array(brainstorms):
    print("calling LLM for cleanup_array...")
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
        return cleanup_array(brainstorms)

def summarize_input_from_context(category, input, context):
    print("calling LLM for summarize_input_from_context...")
    user_message = (
        f"This is for the category {category}. This is the current input {input}. This is the current context {context}"
    )
    system_message = f"""You are a helpful assistant that helps summarize the problem specification of a given category. {MATRIX_DESCRIPTION}
    You are provided context in question and answer form, and the current input. Based on this, for the appropriate category, the specification for that category.
    THE SUMMARY SHOULD BE NO MORE THAN 50 WORDS. NO NEED TO WRITE "BASED ON THE CONTEXT FROM CATEOGRY..."
    """
    res =  call_llm(system_message, user_message)
    print("sucessfully called LLM for summarize_input_from_context", res)
    return res