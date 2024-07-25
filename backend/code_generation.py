# This file handles saving mocked data, generating, and cleaning up the code based on the task list

import globals
from globals import call_llm
from utils import (
    create_and_write_file,
    create_folder,
    delete_folder,
    folder_exists,
    read_file,
)

# HOW CODE GENERATION FOLDER WORKS
# - They will all rest in generated/generations_[timestamp]_[uuid]
# - They will all have a faked_data.json file

# - for lock step
# [code_folder_path]/index.html - main code that is changed and updated constantly
# [code_folder_path]/checked.html - after all the steps, the final checked code
# [code_folder_path]/cleaned.html - after all the steps, the final cleaned code
# [code_folder_path]/[task_id]/merged.html - initial generated code per task_id
# [code_folder_path]/[task_id]/checked.html - checked generated code per task_id - currently not being used
# [code_folder_path]/[task_id]/cleaned.html - cleaned generated code per task_id

# for one shot
# index.html - main code that is changed and updated constantly
# initial.html - initial code
# checked.html - checked code
# cleaned.html - cleaned code

get_faked_data_code = """
useEffect(() => {
        fetch('http://127.0.0.1:5000/get_faked_data')
          .then(response => response.json())
          .then(data => setRecipes(JSON.parse(data.faked_data)))
          .catch(error => console.error('Error fetching data:', error));
      }, []);
"""
sample_code = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const {
      Button,
      Container,
      Typography,
      TextField,
    } = MaterialUI;

    const { useState, useEffect } = React;

    function App() {
      const [count, setCount] = useState(0);
      const [name, setName] = useState('');

      useEffect(() => {
        document.title = \`Count: \${count}\`;
      }, [count]);

      return (
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Hello, React with Material-UI and Hooks!
          </Typography>
          <Typography variant="h5">
            Count: {count}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setCount(count + 1)}>
            Increment
          </Button>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <Typography variant="h6">
            Name: {name}
          </Typography>
        </Container>
      );
    }

    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
"""

def get_fake_data(prompt):
	print("calling LLM for get_fake_data...")
	system_message = """
        You are generating fake JSON data for a UI that a user wants to create. Given the context, please generate a JSON array of fake data with appropriate fields. Here is an example:

        User Input: I want to create a UI that visualizes a beauty store's inventory.

        System result:
        [
            {
                "id": 11,
                "title": "perfume Oil",
                "description": "Mega Discount, Impression of A...",
                "price": 13,
                "discountPercentage": 8.4,
                "rating": 4.26,
                "stock": 65,
                "brand": "Impression of Acqua Di Gio",
                "category": "fragrances",
            },
            {
                "id": 12,
                "title": "perfume Oil",
                "description": "Half Off",
                "price": 15,
                "discountPercentage": 12.3,
                "rating": 3.46,
                "stock": 2343,
                "brand": "Victoria Secret",
                "category": "fragrances",
            },
        ]
        Please follow these rules while creating the JSON array
        1. Please only return the JSON array and nothing else.
        2. Array length should be length 20.
        3. Please ensure that the generated data makes sense.
    """
	user_message = "please generate data given this UI: " + prompt
	res = call_llm(system_message, user_message)
	print("sucessfully called LLM for get_fake_data", res)
	return res

# this code generated is one shot
def implement_plan(prompt, plan, design_hypothesis, code_folder_path):
	print("calling LLM for implement_plan...")
	cleaned_code_file_path = f"{code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	initial_code_file_path = f"{code_folder_path}/initial.html"
	main_code_file_path = f"{code_folder_path}/{globals.MERGED_CODE_FILE_NAME}"
	get_ui_code(prompt, plan, design_hypothesis, initial_code_file_path, main_code_file_path)
	# overall_check(design_hypothesis, checked_code_file_path, main_code_file_path)
	cleanup_code(cleaned_code_file_path, main_code_file_path)
	return main_code_file_path

def get_ui_code(plan, task, design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path):
	print("calling LLM for get_ui_code...")
	previous_code = read_file(previous_task_main_code_file_path)
	user_message = f"Please execute this task: {task}"
	system_message = f"""
                You are working on an app dsecribed here: {design_hypothesis}.
                The entire app will be written in React and MUI within an index.html file. There is only this index.html file for the entire app.
				We've broken down the development of it into these tasks: {plan}.
				Currently, you are working on this task: {task}.
				For context, this is the faked_data: {globals.faked_data}
				There is already existing code in the index.html file. Using the existing code {previous_code}.
				Please add to the existing code and implement this task. Write React and MUI code, and html, javascript, and css.
				PLEASE DO NOT DELETE EXISTING CODE. DO NOT DELETE EXISTING DATA.
				DO NOT COMMENT PARTS OF THE CODE OUT AND WRITE /* ... (rest of the code) */.
				RETURN THE ENTIRE RELEVANT CODE TO HAVE THE APP WORK.
				MAKE SURE ALL THE HOOK TO GRAB THE FAKED_DATA IS INSIDE THE CODE.
                Return the FULL CODE NEEDED TO HAVE THE APP WORK, INSIDE THE INDEX.HTML file.
"""
	code = call_llm(system_message, user_message)
	create_and_write_file(task_merged_code_file_path, code)
	merged_code_lines = len(code.splitlines())
	previous_code_lines=len(previous_code.splitlines())
	if previous_code_lines-10 > merged_code_lines:
		print("trying again... writing code failed...")
		get_ui_code(plan, task, design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path)
	print("sucessfully called LLM for get_ui_code", code)
	return code

def implement_plan_lock_step(design_hypothesis, plan, code_folder_path, task_id):
	print("calling LLM for implement_plan_lock_step...")
	if len(plan) == 0 or plan is None:
		print("ERROR: there was no plan...")
		return ""
	step = plan[task_id-1]
	print("executing for step " + step["task"])
	task_code_folder_path = f"{code_folder_path}/{step["task_id"]}"
	create_folder(task_code_folder_path)
	task_cleaned_code_file_path = f"{task_code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
	task_merged_code_file_path = f"{task_code_folder_path}/{globals.MERGED_CODE_FILE_NAME}"
	task_main_code_file_path = f"{task_code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
    # TODO: Add this back in the future
    # task_checked_code_file_path = f"{task_code_folder_path}/{globals.CHECKED_CODE_FILE_NAME}"
	if task_id==1:
		implement_first_task(design_hypothesis, step["task"], task_merged_code_file_path)
		cleanup_code(task_cleaned_code_file_path, task_merged_code_file_path, task_main_code_file_path)
		return task_cleaned_code_file_path
	# task_code_file_path = f"{task_code_folder_path}/{globals.TASK_FILE_NAME}"
	previous_task_main_code_file_path = f"{code_folder_path}/{step["task_id"]-1}/{globals.MAIN_CODE_FILE_NAME}"
	# identify_code_changes(plan, step["task"], task_code_file_path, previous_task_main_code_file_path, design_hypothesis)
	# inject_code(step["task"], previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path)
	get_ui_code(plan, step["task"], design_hypothesis, previous_task_main_code_file_path, task_merged_code_file_path)
	cleanup_code(task_cleaned_code_file_path, task_merged_code_file_path, task_main_code_file_path)
	print("finished executing lock step for task_id", {task_id})

def implement_first_task(design_hypothesis, task, task_merged_code_file_path):
	print("calling LLM for implement_first_task...")
	user_message = f"Please execute this task: {task}."
	system_message = f"""
                You are writing HTML, Javascript, and CSS code for creating a UI given a data model. For context, this is the goal: {design_hypothesis}.
				You are creating the initial index.html file for the code to create the basic HTML structure of the code as specified by the task. Implement the design hypothesis based on the task.
                The index.html file will load React and MUI libraries from a CDN. Here is an example of the html file that will be generated: {sample_code}
				For context, this is the faked_data: {globals.faked_data}
                Make sure to grab the faked_data data by using a hook with code similar to this: {get_faked_data_code}

                Follow these rules while writing the code.
				1. Only HTML, Javascript, and CSS code. Particularly, write the script part using React and MUI libraries.
				2. Do not return separate files code. Compile it all together in one file in one component and only send me the code.
				3. Do not type import statements. Assume that MUI and react are already imported libraries, so to use the components simply do so like this: const \{{Button, Container, Typography, TextField \}} = MaterialUI; or const \{{ useState, useEffect \}} = React;
            """
	code = call_llm(system_message, user_message)
	print("called LLM for initial html file code", code)
	user_message = f"This is the existing code {code}"
	system_message = f"""
				Make sure the React and MUI code is wrapped within an index.html structure. MAKE SURE THAT THE INDEX.HTML IS WRAPPED LIKE THIS:
				<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // REACT AND MUI CODE
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
				Do not return separate React and MUI components. Compile it all together in one file (index.html) and in one component and only send me the code.
				Follow this as a sample structure: {sample_code}
            """
	code_with_data = call_llm(system_message, user_message)
	print("called LLM for initial html file code")
	code_with_data = code_with_data
	create_and_write_file(task_merged_code_file_path, code_with_data)
	print("sucessfully called LLM for implement_first_task", code_with_data)

def identify_code_changes(plan, task, task_code_file_path, previous_task_main_code_file_path, design_hypothesis):
	print("calling LLM for identify_code_changes...")
	user_message = f"Please return the array of code-snippets and the line number where you would inject the code as an array for this task: {task}."
	print("previous_task_main_code_file_path ", previous_task_main_code_file_path)
	previous_code = read_file(previous_task_main_code_file_path)
	system_message = f"""
                You are working on an app dsecribed here: {design_hypothesis}.
                The entire app will be written in React and MUI within an index.html file. There is only this index.html file for the entire app.
				We've broken down the development of it into these tasks: {plan}.
				Currently, you are working on this task: {task}.
				There is already existing code in the index.html file. Using the existing code {previous_code}, identify where you would add code to implement ONLY this task and have it fully working.

				Return the response in an array with this format: [{{"line number": line_number, "action": action, "code": code}}],
				where the line number is where you would inject the code given the previous code,
				action is whether or not you are replacing existing code or adding new code (Example: if there is already a search bar and the task asks to implement search functionality, do not create a new search bar. REPLACE the current search bar with the new search bar. Example: Or, if you are to add a column to a table, you should REPLACE the existing table - do not create a new table.),
				code is the actual code you would inject. Only write in React and MUI code.
            """
	injections = call_llm(system_message, user_message)
	create_and_write_file(task_code_file_path, injections)
	print("sucessfully called LLM for identify_code_changes", injections)

def inject_code(task, previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path):
    print("calling LLM for inject_code...")
    task_code = read_file(task_code_file_path)
    previous_code = read_file(previous_task_main_code_file_path) if previous_task_main_code_file_path else ""
    user_message = f"Please merge these code snippets that execute this task {task}: {task_code}"
    system_message = f"""
                You are a code merging system that is merging code snippets into existing code.
				The user will provide an array that shows a line number where you should inject the code snippet.
				This is the previous state of the code: {previous_code}.
				Loop through the list and logically inject the code into the previous code around the given line number so that it compiles properly, while still retaining previous logic.
				Replace code if the task requires you to replace a specific line of code.
				For example, if there is already a search bar and the task asks to implement search functionality, do not create a new search bar. Replace the current search bar with the new search bar. Or, if you are to add a column to a table, you should REPLACE the existing table - do not create a new table.
				Otherwise, you must KEEP all previous code - you should not modify any of the previous code. Simply inject the code snippet to the line number.
				DO NOT write comments similar to /* existing code goes here*/, or /* existing styles here... */, /* existing data items here... */, or anything similar.
				KEEP all the data. Do NOT truncate data items, or comment out data items in the array. KEEP ALL DATA ITEMS.
				Keep all the previous code in one file.
				The code should be in this format with no natural language: {sample_code}
            """
    res = call_llm(system_message, user_message)
    merged_code = f"This is the merged code: \n {res}"
    create_and_write_file(task_merged_code_file_path, merged_code)
    merged_code_lines = len(merged_code.splitlines())
    previous_code_lines=len(previous_code.splitlines())
    if previous_code_lines > merged_code_lines:
        print("injecting code again... merge failed...")
        inject_code(task, previous_task_main_code_file_path, task_merged_code_file_path, task_code_file_path)
    print("successfully called LLM for merge_code...")

def get_iterate_code(problem, task, task_code_folder_path, current_iteration_folder_path, design_hypothesis):
    print("calling LLM for get_iterate_code...")
    task_main_code_file_path = f"{task_code_folder_path}/{globals.MAIN_CODE_FILE_NAME}"
    # task_cleaned_code_file_path = f"{task_code_folder_path}/{globals.CLEANED_CODE_FILE_NAME}"
    # task_debug_code_file_path = f"{current_iteration_folder_path}/{globals.ITERATION_FILE_NAME}"
    task_debug_merge_file_path = f"{current_iteration_folder_path}/{globals.ITERATION_MERGE_FILE_NAME}"
    task_debug_cleaned_code_file_path = f"{current_iteration_folder_path}/{globals.ITERATION_CLEANED_FILE_NAME}"
    task_code = read_file(task_main_code_file_path)
    user_message = f"Please fix the problem that the user describes: {problem}, please fix the problem in the existing code and return the entire code! Thank you!"
    system_message = f"""
                A coding task has been implemented for a project we are working on.
				For context, this is the project description: {design_hypothesis}. The task was this: {task}. This is the faked_data: {globals.faked_data}
				However, the task was not implemented fully correctly. The user explains what is wrong in the problem {problem}.
				There is already existing code in the index.html file. Using the existing code {task_code}.
				Please add to the existing code and fix the problem. Write React and MUI code, and html, javascript, and css.
				PLEASE DO NOT DELETE EXISTING CODE. DO NOT DELETE EXISTING DATA.
                Return the FULL CODE NEEDED TO HAVE THE APP WORK, INSIDE THE INDEX.HTML file.
            """
    iterated_code = call_llm(system_message, user_message)
    create_and_write_file(task_debug_merge_file_path, iterated_code)
    # inject_code(problem, task_cleaned_code_file_path, task_debug_merge_file_path, task_debug_code_file_path)
    cleanup_code(task_debug_cleaned_code_file_path, task_debug_merge_file_path, task_main_code_file_path)
    print("successfully called LLM for get_iterate_code...", iterated_code)
    return task_main_code_file_path


def test_code_per_lock_step(task, design_hypothesis):
    print("calling LLM for test_code_per_lock_step...")
    user_message=f"Provide test cases for the user to test that this task {task} was successfully implemented."
    system_message = f"""
                You are helping a user test their code given a certain task. The user will test their code on the UI. Assume the  UI is already open on the web browser. Provide 1-3 examples of how the user should test their UI to check that the task works.
				For context, the overall application has this design: {design_hypothesis}.
				However, you are focused on testing the TASK specified. The task you are helping the user check is this: {task}.
                There is no need to test responsiveness of HTML regarding browser size.
				Return the response in an array with this format: [test1, test2], where test1 and test2 are strings describing how to test the code.
				
				For example, if the design hypothesis was: "The UI will be designed as a table, resembling Gmail, featuring columns like 'Item name', 'Quantity', 'Expiration Date', and 'Category'. Users can add, delete and update items. Clicking a row will open a detailed view of the item, including its nutritional information. A search bar, at the top, allows users to quickly find specific items.",
				and the task was: "Create a form with fields corresponding to the table columns to add new items", an example response could be: ["Clicking the 'Add Now' button should have a form pop up to add items", "Entering items into the form should add it to the table"]
            """
    cases = call_llm(system_message, user_message)
    print("sucessfully called LLM for test_code_per_lock_step", cases)
    return cases

def cleanup_code(cleaned_code_file_path, code_file_path, task_main_code_file_path):
	print("calling LLM for cleanup_code...")
	code = read_file(code_file_path)
	user_message = f'This is the code: \n {code}'
	system_message=f"""
                You are cleaning up React and MUI code to ensure that it runs on first try.
				If the code runs on first try, return the code. DO NOT RETURN ANYTHING ELSE, DO NOT RETURN SOMETHING LIKE "This code is already cleaned."
				DO NOT DELETE ANY CODE. Only remove natural language. The goal is to have the code compile. Comments are okay.
				This is an EXAMPLE of a result: {sample_code}.
				MAKE SURE THAT THE CODE IS WRAPPED LIKE THIS:
				<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App with MUI and Hooks</title>
  <!-- Load React and ReactDOM from CDN -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Load MUI from CDN -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <script src="https://unpkg.com/@mui/material@5.0.0-rc.1/umd/material-ui.development.js" crossorigin></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // REACT AND MUI CODE
    const rootElement = document.getElementById('root');
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  </script>
</body>
</html>
            """
	cleaned_code = call_llm(system_message, user_message)
	create_and_write_file(cleaned_code_file_path, cleaned_code)
	# every time we clean code it's the end of the step and we probably want to update the index.html file
	create_and_write_file(task_main_code_file_path, cleaned_code)
	print("successfully called LLM for cleanup_code: " + cleaned_code)

def wipeout_code(code_folder_path, task_id, plan):
	print(f"wiping out code from task id {task_id}")
	num_steps = len(plan)
	initial_index = task_id-1
	for i in range(initial_index, num_steps):
		step = plan[i]
		task_code_folder_path = f"{code_folder_path}/{step["task_id"]}"
		if not folder_exists(task_code_folder_path):
			break
		delete_folder(task_code_folder_path)
		task_code_iteration_folder_path = f"{code_folder_path}/{step["task_id"]}/{globals.ITERATION_FOLDER_NAME}"
		delete_folder(task_code_iteration_folder_path)
		globals.task_map[initial_index+1][globals.CURRENT_DEBUG_ITERATION] = 0
		globals.task_map[initial_index+1][globals.DEBUG_ITERATION_MAP] = {}
	print(f"successfully wiped out code from task id {task_id}")
