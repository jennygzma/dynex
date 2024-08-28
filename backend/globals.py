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

anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

anthropic_client = Anthropic(api_key=anthropic_api_key)
openai_client = OpenAI(api_key=openai_api_key)


def call_llm(system_message, user_message, llm=globals.LLM):
    if llm == "anthropic":
        temperature = secrets.randbelow(10**6) / 10**6
        message = anthropic_client.messages.create(
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
    message = openai_client.chat.completions.create(model="gpt-4", messages=messages)
    return message.choices[0].message.content


MATRIX_FILE_NAME = "matrix.txt"
FAKED_DATA_FILE_NAME = "faked_data.json"
SPEC_FILE_NAME = "spec.txt"
TOOLS_REQUIREMENT_FILE_NAME = "tools_requirement.json"

PROBLEM_FILE_NAME = "problem.txt"
PROTOTYPES = "prototypes.txt"
MATRIX_FOLDER_NAME = "matrix"
CATEGORY_FILE_NAME = {
    "PersonXIdea": "PersonXIdea.txt",
    "PersonXGrounding": "PersonXApproach.txt",
    "ApproachXIdea": "ApproachXIdea.txt",
    "ApproachXGrounding": "ApproachXGrounding.txt",
    "InteractionXIdea": "InteractionXIdea.txt",
    "InteractionXGrounding": "InteractionXGrounding.txt",
}
PROMPT_FILE_NAME = "prompt.txt"
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

# matrix fields
problem = None
matrix = {
    "PersonXIdea": None,
    "PersonXGrounding": None,
    "ApproachXIdea": None,
    "ApproachXGrounding": None,
    "InteractionXIdea": None,
    "InteractionXGrounding": None,
}
# all prototypes to explore
prototypes = []
current_prototype = None
# folder for this code generation, in the form of a UUID
folder_path = None
