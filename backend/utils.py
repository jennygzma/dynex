import os

def create_folder(folder_path):
    try:
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"folder created at {folder_path}")
        else:
            print(f"folder_path {folder_path} already exists")
    except Exception as e:
        print(f"error creating folder {folder_path}, {e}")
        
def create_and_write_file(file_path, text):
    try:
        # Open the file in write mode (this will create the file if it doesn't exist)
        with open(file_path, 'w') as file:
            file.write(text)
        print(f"Text written to file '{file_path}' successfully.")
    except Exception as e:
        print(f"Error writing to file '{file_path}': {e}")

def read_file(file_path):
    try:
        # Open the file in read mode
        with open(file_path, 'r') as file:
            # Read the contents of the file
            content = file.read()
        return content
    except Exception as e:
        print(f"Error reading from file '{file_path}': {e}")
