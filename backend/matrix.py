# This file handles brainstorming the design spec and creating the task list.
import json

from globals import call_llm

PPAI_DESCRIPTION = """When we create a UI based on a particular problem, we define it with a 3x2 problem matrix.
First, we problem further into 3 categories: Person, Approach, and Interaction Paradigm.
Within each category, there are 2 more sub-categories: idea and grounding."""

MATRIX_DESCRIPTIONS = {
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
PersonXIdea: Single person
PersonXGrounding: - Difficulty in finding potential partners who meet specific criteria like race, religion, age, or occupation. \n - Challenges in efficiently filtering through dating apps to locate compatible matches. \n - Need for an application that streamlines the process by allowing users to set precise criteria and receive curated suggestions.
ApproachXIdea: Searchable Database to allow people to search for people based on specified criteria
ApproachXGrounding: - Ensure the database includes comprehensive filters such as age, gender, sex, religion, and occupation to meet users' specific search criteria. \n - Develop a robust and scalable search algorithm that efficiently handles large datasets and returns accurate results based on the selected filters. \n - Implement user-friendly search and filtering interfaces that make it easy for users to apply multiple criteria and refine their search results.
InteractionXIdea: Faceted Browsing
InteractionXGrounding: - Provide users with multiple facet filters, including age, gender, religion, occupation, and location, to refine their search effectively. \n - Ensure the UI dynamically updates search results in real-time as users adjust their facet filters, offering immediate feedback. \n - Design intuitive navigation with clear options to reset filters, switch criteria, and save searches, using checkboxes, sliders, and dropdowns for ease of use.

Tinder:
PersonXIdea: Single person
PersonXGrounding: - Users often struggle to find matches that meet their physical preferences quickly and efficiently. \n - The abundance of profiles makes it challenging to identify those that align with specific looks or appearances. \n - A streamlined approach to swiping and filtering by appearance would help users connect with potential matches faster, focusing on visual attraction.
ApproachXIdea: Lower the cognitive load by providing less information, making it easier to judge potential matches quickly
ApproachXGrounding: - Limit the displayed information to essential details, such as a single profile photo and a brief tagline, to encourage snap judgments. \n - Focus on visual appeal as the primary matching criterion, reducing the need for users to sift through extensive profiles. \n - Use an algorithm to prioritize matches based on visual preferences and minimal data inputs, streamlining the matching process.
InteractionXIdea: Card Swipe
InteractionXGrounding: - Each card should prominently feature a large profile photo, as visual appeal is the primary factor in this interaction. \n - Include minimal text, such as the person’s name, age, and a short tagline or fun fact, to provide just enough context without overwhelming the user. \n - Add simple icons or buttons for actions like "Like" or "Pass," ensuring that users can quickly swipe or tap to make their choice.

Coffee Meets Bagel:
PersonXIdea: Single person
PersonXGrounding: - Users who are looking for serious relationships prefer fewer, high-quality matches over endless swiping. \n - The overwhelming number of potential matches on other apps can make it difficult to focus on finding a meaningful connection.\n - An app designed for serious dating should streamline the process by offering a curated selection of potential partners, reducing time spent on the app.
ApproachXIdea: Lower the cognitive load by having less matches to make more intentional judgements
ApproachXGrounding: - Present a select number of potential matches each day to prevent decision fatigue and promote thoughtful consideration.\n - Display key information like shared interests, compatibility indicators, and mutual friends to aid decision-making without overwhelming the user. \n - Prioritize quality over quantity, ensuring that each match is relevant to the user’s preferences and relationship goals.
InteractionXIdea: Feed with 5 options to date
InteractionXGrounding: - The daily message should include a concise profile summary for each of the five matches, highlighting essential details such as name, age, occupation, and a short personal note or shared interest. \n - Include compatibility scores or commonalities (e.g., mutual friends, hobbies) to help users quickly assess each match’s potential. \n - Provide clear action buttons within the message to either like, pass, or start a conversation, making it easy for users to engage with their daily options.
"""

PERSONXIDEA_EXAMPLES = """Person ideas focus on who the target user of the application is.
For example, if the idea is "learn chinese", some examples of users are "30 year old english-speaking student" or or "busy professional who only has 30 minutes a day to learn chinese"
If the idea is "journaling app", some examples of users are "someone struggling with depression" or "someone going through a breakup". If the idea is "finding a nail salon", some examples are "celebrity assistant looking for personalized nail salon" or "female teenager looking for affordable nail salons". For OkCupid, the PersonXIdea is "Single person looking for a partner." For Tinder, the PersonXIdea is "Single person looking for hookups." For CoffeeMeetsBagel, the PersonXIdea is "Single person looking for a serious life partner".
"""
PERSONXGROUNDING_EXAMPLES = """Person Grounding focuses on the goal of the application and what problem it's trying to solve for the person.
For example, if the idea is to "learn chinese" for "a 30 year old english-speaking student", some example goals of the application could be "gain vocabulary to travel to China for a week and learn Chinese in 3 weeks", versus "learn grammar".
If the idea is "finding a nail salon" for "a female teenager", the goal of the application could be to "explore a all the nail salons in NYC to formulate where to go when I visit", or "go to a nail salon ASAP for prom".
For OkCupid, where the PersonXIdea is "Single person looking for a partner.":  - Difficulty in finding potential partners who meet specific criteria like race, religion, age, or occupation. \n - Challenges in efficiently filtering through dating apps to locate compatible matches. \n - Need for an application that streamlines the process by allowing users to set precise criteria and receive curated suggestions.
For Tinder, where the PersonXIdea is "Single person looking for hookups.": - Users often struggle to find matches that meet their physical preferences quickly and efficiently. \n - The abundance of profiles makes it challenging to identify those that align with specific looks or appearances. \n - A streamlined approach to swiping and filtering by appearance would help users connect with potential matches faster, focusing on visual attraction.
For CoffeeMeetsBagel, where the PersonXIdea is "Single person looking for a serious life partner": - Users who are looking for serious relationships prefer fewer, high-quality matches over endless swiping. \n - The overwhelming number of potential matches on other apps can make it difficult to focus on finding a meaningful connection.\n - An app designed for serious dating should streamline the process by offering a curated selection of potential partners, reducing time spent on the app.
"""

APPROACHXIDEA_EXAMPLES = """Approach ideas focus more on what ideas should be implemented as the core logic (backend) of the application based on person context on what the problem is.
It could be a theory within a domain the app will be built in like spaced repetition for learning apps, subjective expected utility for recommendation or search apps, CBT or ACT for mental health apps, gamification, or CLT for decisionmaking.
It could be an app solution, such as a rules-based system to generate outfit recommendations based off rules, Uber for X to match users with homes (airBnb is uber for homes), marketplace system to shop for used cars, workflow system to develop a joke iteratively, database (logging or reading) system to search for grocery stores, social network
When answering, provide the general approach and a short sentence as to how this would help solve the problem.
For OkCupid: Searchable Database to allow people to search for people based on specified criteria
For Tinder: Lower the cognitive load by providing less information, making it easier to judge potential matches quickly
For CoffeeMeetsBagel: Lower the cognitive load by having less matches to make more intentional judgements
"""

INTERACTIONXIDEA_EXAMPLES = """The Interaction ideas focuses on the UI Paradigm in the front end, such as the layout and interactoin paradigms.
Examples include chatbot (messaging), cardswipe (tinder), feed (facebook, tiktok, twitter, news), faceted browsing, table (gmail).
Approaches generally have a simple basic for UI which people gravitate towards. For example, a searchable database can easily have a table-like UI, but pairing approaches with non-obvious UIs is interesting, such as Card-Swipe UI.
The InteractionXIdea should also brainstorm some nonobvious InteractionXIdeas.
The application is a UI app. Do not recommend a mobile app. The app cannot suggest any carousels, since it is a UI. For example, if the prompt suggests a swiping interface, in the UI the "swipe" would be done by clicking, since it is not a mobile interface.
For OkCupid: Faceted Browsing
For Tinder: Card Swipe
For CoffeeMeetsBagel: Feed with 5 options to date
"""

APPROACHXGROUDING_EXAMPLES = """Approach Grounding should focus on how exactly the approach idea should be implemented, while factoring in other context such as the Person and problem context.
Ensure that you understand what the approach idea is exactly before thinking about how you would ground it.
This section should NOT focus on what the use interaction or interface should be. It is only figuing out how to implement the ApproachXIdea, given the other context for the problem.
DO NOT TAKE A RANDOM IDEA AND GROUND IT. IF THE APPROACHXIDEA IS GENERATION AND ELABORATION, FIGURE OUT HOW TO GROUND IT. DO NOT SUDDENLY COME UP WITH SPACED REPETITION.
For OkCupid, where the ApproachXIdea is "Searchable database to allow people to search for people based on specific critera", the ApproachXGrounding is: - Ensure the database includes comprehensive filters such as age, gender, sex, religion, and occupation to meet users' specific search criteria. \n - Develop a robust and scalable search algorithm that efficiently handles large datasets and returns accurate results based on the selected filters. \n - Implement user-friendly search and filtering interfaces that make it easy for users to apply multiple criteria and refine their search results.
For Tinder, where the ApproachXIdea is "Lower the cognitive load by providing less information, making it easier to judge potential matches quickly", the ApproachXGrounding is: - Limit the displayed information to essential details, such as a single profile photo and a brief tagline, to encourage snap judgments. \n - Focus on visual appeal as the primary matching criterion, reducing the need for users to sift through extensive profiles. \n - Use an algorithm to prioritize matches based on visual preferences and minimal data inputs, streamlining the matching process.
For CoffeeMeetsBagel, where the ApproachXIdea is "Lower the cognitive load by providing less information, making it easier to judge potential matches quickly", the ApproachXGrounding is: - Present a select number of potential matches each day to prevent decision fatigue and promote thoughtful consideration.\n - Display key information like shared interests, compatibility indicators, and mutual friends to aid decision-making without overwhelming the user. \n - Prioritize quality over quantity, ensuring that each match is relevant to the user’s preferences and relationship goals.
"""

INTERACTIONXGROUNDING_EXAMPLES = """Interaction Grounding should focus on how exactly the interaction idea of the UI Paradigm should be implemented, while factoring in other context.
Keep in mind that we do not have the capacity to build a super fancy application. KEEP THE APPLICATION IN SCOPE TO THE USER PROBLEM AND THEORY AS MUCH AS POSSIBLE BECAUSE THERE IS LIMITED CODE WE CAN WRITE. For example, if this is the prompt: "Create a web UI based on this idea: learn chinese, for users: Retired person seeking a mentally stimulating hobby and a way to connect with their cultural heritage, where the application goal is: To gain conversational fluency to communicate with family members and explore ancestral roots. Use the theory of Spaced Repetition (Reviewing information at optimal intervals reinforces memory and aids long-term retention of the language.), which with interaction pattern Interactive storytelling (A narrative-driven approach with dialogues and scenarios, reinforcing vocabulary and phrases through an engaging story with spaced repetition of key elements.) to guide the design.", we should focus on implementing the spaced repetition part - unnecessary features like a social community feature, or working with multiple different stories is overly complex, as is is multiple decks, a setting bar, a profile page.
Only brainstorm interactions that are based in web UI. We cannot support mobile interfaces - so carousel, or push notifications, maps view, cannot be supported.
For OkCupid, where the InteractionXIdea is "Faceted Browsing", the InteractionXGrounding is: - Provide users with multiple facet filters, including age, gender, religion, occupation, and location, to refine their search effectively. \n - Ensure the UI dynamically updates search results in real-time as users adjust their facet filters, offering immediate feedback. \n - Design intuitive navigation with clear options to reset filters, switch criteria, and save searches, using checkboxes, sliders, and dropdowns for ease of use.
For Tinder, where the InteractionXIdea is "Card Swipe", the InteractionXGrounding is: - Limit the displayed information to essential details, such as a single profile photo and a brief tagline, to encourage snap judgments. \n - Focus on visual appeal as the primary matching criterion, reducing the need for users to sift through extensive profiles. \n - Use an algorithm to prioritize matches based on visual preferences and minimal data inputs, streamlining the matching process.
For CoffeeMeetsBagel, where the InteractionXIdea is "Feed with 5 options to date", the InteractionXGrounding is: - The daily message should include a concise profile summary for each of the five matches, highlighting essential details such as name, age, occupation, and a short personal note or shared interest. \n - Include compatibility scores or commonalities (e.g., mutual friends, hobbies) to help users quickly assess each match’s potential. \n - Provide clear action buttons within the message to either like, pass, or start a conversation, making it easy for users to engage with their daily options.
"""

MATRIX_EXAMPLES = {
    "PersonXIdea": PERSONXIDEA_EXAMPLES,
    "PersonXGrounding": PERSONXGROUNDING_EXAMPLES,
    "ApproachXIdea": APPROACHXIDEA_EXAMPLES,
    "ApproachXGrounding": APPROACHXGROUDING_EXAMPLES,
    "InteractionXIdea": INTERACTIONXIDEA_EXAMPLES,
    "InteractionXGrounding": INTERACTIONXGROUNDING_EXAMPLES,
}

MATRIX_DESCRIPTION = f"{PPAI_DESCRIPTION} + {" ".join(MATRIX_DESCRIPTIONS.values())}"

def get_context_from_other_inputs(problem, category, matrix):
    print(matrix)
    compiled_text = f"{problem}\n"
    if category is not None and "Idea" in category:
        skipped = category.replace("Idea", "Grounding")
    else:
        skipped = ""

    for key, value in matrix.items():
        if key == category:
            continue
        if not value:
            continue
        if category is not None and "Idea" in category and key == skipped:
            continue
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
    res = call_llm(system_message, user_message, llm="openai")
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
    res = call_llm(system_message, user_message, llm="openai")
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
    {PPAI_EXAMPLES}
    For the given category, determine whether or not the user needs to add more specification based on the current level of specification for the category.
    If the current input is empty, then the given category definitely needs more specification.
    Ensure that for the category, there is a defined answer that does not go in multiple directions. The system should detect if the answer is too broad.
    If the problem specified has too many dimensions, then the categories would need to narrow down the specification.
    For example, if the problem says "learn japanese with flashcards and stories to learn more anime", then the “Approach Idea” category should try to narrow down the approach to either "flashcards" or "stories".
    If the prompt was "learn japanese to read and write to watch anime", then the "Person Grounding" category should narrow down the true problem goal, whether it is to "read japanese" or "write japanese" to watch anime.
    If the problem needs specification, please return "needs specification". If not, return "no specification needed". DO NOT RETURN ANYTHING ELSE.
    ENSURE THAT THE RETURNED RESPONSE IS EITHER "needs specification" or "no specification needed".
    ENSURE THAT THE RETURNED RESPONSE IS EITHER "needs specification" or "no specification needed".
    ENSURE THAT THE RETURNED RESPONSE IS EITHER "needs specification" or "no specification needed".
    """
    user_message = f"This is the input: {input} for category: {category}"
    res = call_llm(system_message, user_message, llm="openai")
    needs_specification = True if res=="needs specification" else False
    print("sucessfully called LLM for get_needs_specification", res)
    return needs_specification

def brainstorm_inputs(category, context, existing_brainstorms, iteration):
    print("calling LLM for brainstorm_inputs...")
    is_grounding = "Grounding" in category
    print(f"category {category} is_grounding {is_grounding}")
    iteration_message = f"The user would also like you to factor this into the brainstormed answer: {iteration}" if iteration != "" else ""
    user_message = f"""This is the category you are brainstorming for: {category}. {iteration_message}.
    Make sure not to repeat brainstorms from this list: {existing_brainstorms}
    """
    grounding_format = """
        The answers should be as specific as possible, but do not be overly verbose in your response. USE AS LITTLE WORDS AS POSSIBLE. Do not repeat what is said in the corresponding idea section.
        The answer should be 50-100 words.
       RETURN THE ANSWER AS A STRING WITH BULLETED LIST. LIMIT TO 3 OR 4 BULLET POINTS IN THE LIST:
       example:
        - The daily message should include a concise profile summary for each of the five matches, highlighting essential details such as name, age, occupation, and a short personal note or shared interest.
        - Include compatibility scores or commonalities (e.g., mutual friends, hobbies) to help users quickly assess each match’s potential.
        - Provide clear action buttons within the message to either like, pass, or start a conversation, making it easy for users to engage with their daily options.
        DO NOT RETURN A PARAGRAPH.
    """ if is_grounding else """
        The answers SHOULD BE 10-15 words WORDS that specify what exactly the idea is. ALL THE ANSWERS MUST BE DIFFERENT FROM ONE ANOTHER.
        Format the the responses in an array like so: ["30 year old english speaking student", "5 year old native"]
        The array should have size 3 maximum.
    """
    system_message = f"""
    You are a helpful assistant that helps brainstorm specification answers for a category to narrow down inputs.
    {MATRIX_DESCRIPTION}
    ONLY IF NECESSARY WILL WE SUPPORT AI/ML features in our application by calling GPT. However, we can only call GPT, so do not suggest "ML Algorithm" or "AI-powered" - it must be "GPT-powered".
    Keep in mind that we cannot support push notifications, physical sensors, emotion scanning, forms of media like audio recordings, videos, etc. We cannot voice record or take photos. All approaches should be able to be implemented with code.
    {PPAI_EXAMPLES}
    Here is the context for this problem: {context}
    {MATRIX_EXAMPLES[category]}
    {grounding_format}
    """
    res = call_llm(system_message, user_message, llm="openai")
    brainstorms = res if is_grounding else cleanup_array("here are the users: " + res)
    print("sucessfully called LLM for brainstorm_inputs", res)
    return brainstorms

def brainstorm_question(category, context):
    print("calling LLM for brainstorm_question...")
    user_message = f"This is the category you are brainstorming for: {category}."
    system_message = f"""You are a helpful assistant that helps brainstorms a relevant question for a category to elicit context from the user. {MATRIX_DESCRIPTION}
        The goal is to brainstorm a question tailored for the current category, given the user context provided from the other cateogires and the current input of the category.
        Here is the context: {context}.
        Generate a question that would best help fill out this category based on the existing context.
        For example, if the problem is "learn japanese" and the PersonXIdea section's input is "me", the PersonXIdea could have sample question like "Is this a beginner or advanced Japanese speaker? Is it for a specific age group or demographic?"
        Or, if the problem is "learn chinese" and in the context, PersonXIdea section's input is "for a retiree who plans on visiting Japan in 3 weeks", the PersonXGrounding section's generated question could be "What type of Japanese words should be taught? Why do current approaches to learn Japanese in 3 weeks for travelling not work?"
        Limit the question to less than 30 words.
    """
    res = call_llm(system_message, user_message, llm="openai")
    print("sucessfully called LLM for brainstorm_questions", res)
    return res


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
    res = "here are the brainstoremd answers: " + call_llm(system_message, user_message, llm="openai")
    theories = cleanup_array(res)
    print("sucessfully called LLM for brainstorm_answers", res)
    return theories


def cleanup_array(brainstorms):
    print("calling LLM for cleanup_array...")
    user_message = f"Please clean up the response so it only returns the array. This is the response: {brainstorms}"
    system_message = """You are an assistant to clean up GPT responses into an array.
			The response should be as formatted: [
                "a", "b", "c"
            ]
            Only the array should be returned. NOTHING OUTSIDE OF THE ARRAY SHOULD BE RETURNED.
            """
    res = call_llm(system_message, user_message, llm="openai")
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
    res =  call_llm(system_message, user_message, llm="openai")
    print("sucessfully called LLM for summarize_input_from_context", res)
    return res