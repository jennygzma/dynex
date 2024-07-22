import os

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
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=4096,
            temperature=0,
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
USER_INPUT_FILE_NAME = "user_input.txt"
PLAN_FILE_NAME = "plan.json"
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

# user provided prompt for what UI should look like
prompt = None
# GPT generated faked data
faked_data = None
# user provided data model
data_model = None
# GPT generated design
design_hypothesis = None
# GPT generated implementation plan
plan = None
# folder for this code generation, in the form of a UUID
folder_path = None
# stores metadata info for each task
task_map = None
