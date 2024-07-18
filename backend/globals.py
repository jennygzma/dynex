import os

from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

FAKED_DATA_FILE_NAME = "faked_data.json"
DESIGN_HYPOTHESIS_FILE_NAME = "design_hypothesis.txt"
USER_INPUT_FILE_NAME = "user_input.txt"
PLAN_FILE_NAME = "plan.json"
TASK_MAP_FILE_NAME = "task_map.json"
GENERATED_FOLDER_PATH = "generated"
MERGED_CODE_FILE_NAME = "merged.txt"
CHECKED_CODE_FILE_NAME = "checked.jsx"
CLEANED_CODE_FILE_NAME = "cleaned.jsx"
TASK_FILE_NAME = "task.txt"
ITERATION_FOLDER_NAME = "iteration"
ITERATION_FILE_NAME = "iteration.txt"
ITERATION_MERGE_FILE_NAME = "iteration_merged.txt"
ITERATION_CLEANED_FILE_NAME = "iteration_clean.jsx"
MAIN_CODE_FILE_NAME = "index.jsx"

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
