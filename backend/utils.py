import os

import globals
from anthropic import Anthropic
from dotenv import load_dotenv
from openai import OpenAI

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
            max_tokens=2048,
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


def create_folder(folder_path):
    try:
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"folder created at {folder_path}")
        else:
            print(f"folder_path {folder_path} already exists")
    except Exception as e:
        print(f"error creating folder {folder_path}, {e}")


# overwrites content of file
def create_and_write_file(file_path, text):
    try:
        # Open the file in write mode (this will create the file if it doesn't exist)
        with open(file_path, "w") as file:
            file.write(text)
        print(f"Text written to file '{file_path}' successfully.")
    except Exception as e:
        print(f"Error writing to file '{file_path}': {e}")


def read_file(file_path):
    try:
        # Open the file in read mode
        with open(file_path, "r") as file:
            # Read the contents of the file
            content = file.read()
        return content
    except Exception as e:
        print(f"Error reading from file '{file_path}': {e}")


def folder_exists(folder_path):
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        print(f"Folder '{folder_path}' exists.")
        return True
    else:
        print(f"Folder '{folder_path}' does not exist.")
        return False


def delete_folder(folder_path):
    try:
        if os.path.exists(folder_path):
            # Walk through the directory tree and delete all files and subdirectories
            for root, dirs, files in os.walk(folder_path, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            # Finally, delete the main directory
            os.rmdir(folder_path)
            print(f"Folder '{folder_path}' has been deleted.")
        else:
            print(f"Folder '{folder_path}' does not exist.")
    except Exception as e:
        print(f"Error deleting folder '{folder_path}': {e}")


def add_comment_to_html_file(html_file_path, comment):
    try:
        with open(html_file_path, "r") as file:
            lines = file.readlines()

        lines.insert(0, f"<!-- {comment} -->\n")

        with open(html_file_path, "w") as file:
            file.writelines(lines)
    except Exception as e:
        print(f"Error writing comment to html file '{html_file_path}': {e}")
