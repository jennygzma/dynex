import os
import secrets

import globals
from anthropic import Anthropic
from dotenv import load_dotenv
from openai import OpenAI

# either anthropic or openai
LLM = "anthropic"

# Load variables from .env file
load_dotenv()

api_key_name = "ANTHROPIC_API_KEY" if globals.LLM == "anthropic" else "OPENAI_API_KEY"
api_key = os.getenv(api_key_name)

if globals.LLM == "anthropic":
    client = Anthropic(api_key=api_key)
else:
    client = OpenAI(api_key=api_key)


def call_llm(system_message, user_message):
    if globals.LLM == "anthropic":
        temperature = secrets.randbelow(10**6) / 10**6
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=4096,
            temperature=temperature,
            system=system_message,
            messages=[{"role": "user", "content": user_message}],
        )
        return message.content[0].text
    messages = [
        {
            "role": "system",
            "content": system_message,
        },
        {
            "role": "user",
            "content": user_message,
        },
    ]
    message = client.chat.completions.create(model="gpt-4", messages=messages)
    return message.choices[0].message.content


FAKED_DATA_FILE_NAME = "faked_data.json"
DESIGN_HYPOTHESIS_FILE_NAME = "design_hypothesis.txt"
IDEA_FILE_NAME = "idea.txt"
USER_FILE_NAME = "user.txt"
GOAL_FILE_NAME = "goal.txt"
PROMPT_FILE_NAME = "prompt.txt"
THEORIES_AND_PARADIGMS_FILE_NAME = "theories_and_paradigms.txt"
TASK_MAP_FILE_NAME = "task_map.json"

GENERATED_FOLDER_PATH = "generated"
MERGED_CODE_FILE_NAME = "merged.txt"
CHECKED_CODE_FILE_NAME = "checked.html"
CLEANED_CODE_FILE_NAME = "cleaned.html"
TASK_FILE_NAME = "task.txt"
ITERATION_FOLDER_NAME = "iteration"
ITERATION_FILE_NAME = "iteration.txt"
ITERATION_MERGE_FILE_NAME = "iteration_merged.txt"
ITERATION_CLEANED_FILE_NAME = "iteration_clean.html"
MAIN_CODE_FILE_NAME = "index.html"

# task_map fields
DEBUG_ITERATION_MAP = "debug_iteration_map"
CURRENT_DEBUG_ITERATION = "current_debug_iteration"

# theory paradigm map fields
DESCRIPTION = "description"
PARADIGMS = "paradigms"
THEORY = "theory"
PARADIGM = "paradigm"

# use case and idea provided by user
idea = None
# user of application
user = None
# goal application is trying to solve
goal = None
# user selected theories to test
theories_and_paradigms = {}
# current theory and paradigm
current_theory_and_paradigm = None
# folder for this code generation, in the form of a UUID
folder_path = None
