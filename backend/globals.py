import os

from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

# either anthropic or openai
LLM = "anthropic"

ANTHROPIC_MODEL = "claude-3-sonnet-20240229"
GPT_MODEL = "gpt-4"

FAKED_DATA_FILE_NAME = "faked_data.json"
DESIGN_HYPOTHESIS_FILE_NAME = "design_hypothesis.txt"
USER_INPUT_FILE_NAME = "user_input.txt"
PLAN_FILE_NAME = "plan.json"
TASK_MAP_FILE_NAME = "task_map.json"
GENERATED_FOLDER_PATH = "generated"
MERGED_CODE_FILE_NAME = "merged.html"
CHECKED_CODE_FILE_NAME = "checked.html"
CLEANED_CODE_FILE_NAME = "cleaned.html"
TASK_FILE_NAME = "task.html"
ITERATION_FOLDER_NAME = "iteration"
ITERATION_FILE_NAME = "iteration.html"
ITERATION_MERGE_FILE_NAME = "iteration_merged.html"
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
