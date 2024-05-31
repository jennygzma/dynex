import os

from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)
FAKED_DATA_FILE_NAME = "faked_data.json"
GENERATED_FOLDER_PATH = "generated"
MAIN_CODE_FILE_NAME = "index.html"
CHECKED_CODE_FILE_NAME = "checked.html"
CLEANED_CODE_FILE_NAME = "cleaned.html"

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
