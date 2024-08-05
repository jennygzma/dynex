# This file acts as a controller to route API requests

import datetime
import json
import uuid

import globals
from code_generation import get_fake_data as get_generated_fake_data
from code_generation import (
    get_iterate_code,
    implement_plan_lock_step,
    test_code_per_lock_step,
    wipeout_code,
)
from flask import Flask, jsonify, request
from planning import get_design_hypothesis as get_generated_design_hypothesis
from planning import get_goal_examples as get_generated_goal_examples
from planning import get_plan as get_generated_plan
from planning import get_plan_from_task_map
from planning import get_theories as get_generated_theories
from planning import get_theories_array
from planning import get_ui_paradigms as get_generated_ui_paradigms
from planning import get_user_examples as get_generated_user_examples
from utils import (
    create_and_write_file,
    create_folder,
    file_exists,
    folder_exists,
    read_file,
)

# Initializing flask app
app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response


@app.route("/get_idea", methods=["GET"])
def get_idea():
    print("calling get_idea...")
    print(globals.idea)
    return (
        jsonify({"message": "getting user input", "idea": globals.idea}),
        200,
    )


@app.route("/save_idea", methods=["POST"])
def save_idea():
    print("calling save_idea...")
    globals.idea = request.json["idea"]
    date_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    if globals.folder_path is None:
        globals.folder_path = (
            f"{globals.GENERATED_FOLDER_PATH}/generations_{date_time}_{uuid.uuid4()}"
        )
        create_folder(globals.folder_path)
    create_and_write_file(
        f"{globals.folder_path}/{globals.IDEA_FILE_NAME}", globals.idea
    )
    return jsonify({"message": "Saved idea"}), 200


@app.route("/get_user", methods=["GET"])
def get_user():
    print("calling get_user...")
    print(globals.user)
    return (
        jsonify({"message": "getting user", "user": globals.user}),
        200,
    )


@app.route("/save_user", methods=["POST"])
def save_user():
    print("calling save_user...")
    globals.user = request.json["user"]
    create_and_write_file(
        f"{globals.folder_path}/{globals.USER_FILE_NAME}", globals.user
    )
    return jsonify({"message": "Saved user"}), 200


@app.route("/brainstorm_user_examples", methods=["GET"])
def brainstorm_user_examples():
    print("calling brainstorm_user_examples...")
    user_examples = get_generated_user_examples(globals.idea)
    return (
        jsonify(
            {"message": "Generated brainstorm_user_examples", "examples": user_examples}
        ),
        200,
    )


@app.route("/get_goal", methods=["GET"])
def get_goal():
    print("calling get_goal...")
    print(globals.goal)
    return (
        jsonify({"message": "getting goal", "goal": globals.goal}),
        200,
    )


@app.route("/save_goal", methods=["POST"])
def save_goal():
    print("calling save_goal...")
    globals.goal = request.json["goal"]
    create_and_write_file(
        f"{globals.folder_path}/{globals.GOAL_FILE_NAME}", globals.goal
    )
    return jsonify({"message": "Saved goal"}), 200


@app.route("/brainstorm_goal_examples", methods=["GET"])
def brainstorm_goal_examples():
    print("calling brainstorm_goal_examples...")
    goal_examples = get_generated_goal_examples(globals.idea, globals.user)
    return (
        jsonify(
            {"message": "Generated brainstorm_goal_examples", "examples": goal_examples}
        ),
        200,
    )


@app.route("/brainstorm_theories", methods=["POST"])
def brainstorm_theories():
    print("calling brainstorm_theories...")
    theory_examples = get_generated_theories(
        globals.idea,
        globals.user,
        globals.goal,
        get_theories_array(globals.theories_and_paradigms),
    )
    return jsonify({"message": "Generated theories", "examples": theory_examples}), 200


@app.route("/get_theories", methods=["GET"])
def get_theories():
    print("calling get_theories...")
    return (
        jsonify(
            {
                "message": "getting theories",
                "theories": get_theories_array(globals.theories_and_paradigms),
            }
        ),
        200,
    )


@app.route("/brainstorm_ui_paradigms", methods=["GET"])
def brainstorm_ui_paradigms():
    print("calling brainstorm_ui_paradigms...")
    theory = request.args.get("theory")
    paradigms = globals.theories_and_paradigms.get(theory, {}).get(
        globals.PARADIGMS, {}
    )
    paradigm_examples = get_generated_ui_paradigms(
        globals.idea, globals.user, globals.goal, theory, paradigms
    )
    return (
        jsonify({"message": "Generated UI Paradigms", "examples": paradigm_examples}),
        200,
    )


@app.route("/get_ui_paradigms", methods=["GET"])
def get_ui_paradigms():
    print("calling get_ui_paradigms...")
    print(request.args)
    theory = request.args.get("theory")
    paradigms = globals.theories_and_paradigms.get(theory, {}).get(
        globals.PARADIGMS, []
    )
    return (
        jsonify(
            {
                "message": "get_ui_paradigms",
                "paradigms": paradigms,
            }
        ),
        200,
    )


@app.route("/get_theories_and_paradigms", methods=["GET"])
def get_theories_and_paradigms():
    print("calling get_theories_and_paradigms...")
    theories_and_paradigms_array = [
        f"{theory}+{paradigm[globals.PARADIGM]}"
        for theory, details in globals.theories_and_paradigms.items()
        for paradigm in details[globals.PARADIGMS]
    ]
    return (
        jsonify(
            {
                "message": "Retrieved theories and paradigms",
                "theories_and_paradigms": theories_and_paradigms_array,
            }
        ),
        200,
    )


@app.route("/save_selected_theory_and_paradigms", methods=["POST"])
def save_selected_theory_and_paradigms():
    print("calling save_selected_theory_and_paradigms...")
    data = request.json
    theory = data["theory"]
    paradigms = data["paradigms"]
    theory_description = data["theoryDescription"]
    if theory not in globals.theories_and_paradigms:
        globals.theories_and_paradigms[theory] = {}
    if globals.PARADIGMS not in globals.theories_and_paradigms[theory]:
        globals.theories_and_paradigms[theory][globals.PARADIGMS] = []
    globals.theories_and_paradigms[theory][globals.PARADIGMS] = paradigms
    globals.theories_and_paradigms[theory][globals.DESCRIPTION] = theory_description
    create_and_write_file(
        f"{globals.folder_path}/{globals.THEORIES_AND_PARADIGMS_FILE_NAME}",
        json.dumps(globals.theories_and_paradigms),
    )
    for theory in get_theories_array(globals.theories_and_paradigms):
        for paradigm in globals.theories_and_paradigms[theory[globals.THEORY]][
            globals.PARADIGMS
        ]:
            folder_path = f"{globals.folder_path}/{theory[globals.THEORY]}+{paradigm[globals.PARADIGM]}"
            paradigm_name = paradigm[globals.PARADIGM]
            paradigm_description = paradigm[globals.DESCRIPTION]
            theory_name = theory[globals.THEORY]
            theory_description = theory[globals.DESCRIPTION]
            create_folder(f"{folder_path}")
            prompt = f"Create a web UI based on this idea: {globals.idea}, for users: {globals.user}, where the application goal is: {globals.goal}. Use the theory of {theory_name} ({theory_description}), which with interaction pattern {paradigm_name} ({paradigm_description}) to guide the design."
            create_and_write_file(f"{folder_path}/{globals.PROMPT_FILE_NAME}", prompt)
    return jsonify({"message": "Saved selected theories"}), 200


@app.route("/set_current_theory_and_paradigm", methods=["POST"])
def set_current_theory_and_paradigm():
    print("calling set_current_theory_and_paradigm...")
    data = request.json
    globals.current_theory_and_paradigm = data["theoryAndParadigm"]
    return (
        jsonify(
            {
                "message": "Set Current Theory",
                "theory_and_paradigm": globals.current_theory_and_paradigm,
            }
        ),
        200,
    )


@app.route("/get_prompt", methods=["GET"])
def get_prompt():
    print("calling get_prompt...")
    prompt = read_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.PROMPT_FILE_NAME}"
    )
    return (
        jsonify(
            {
                "message": "getting prompt for theory",
                "prompt": prompt,
            }
        ),
        200,
    )


@app.route("/save_prompt", methods=["POST"])
def save_prompt():
    print("calling save_prompt...")
    prompt = request.json["prompt"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    create_and_write_file(
        f"{folder_path}/{globals.PROMPT_FILE_NAME}",
        prompt,
    )
    task_map_json = (
        json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
        if file_exists(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}")
        else {}
    )
    task_map = {int(key): value for key, value in task_map_json.items()}
    if folder_exists(f"{folder_path}/1"):
        wipeout_code(folder_path, 1, task_map, globals.current_theory_and_paradigm)
    create_and_write_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}",
        "",
    )
    create_and_write_file(
        f"{folder_path}/{globals.FAKED_DATA_FILE_NAME}",
        "",
    )
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        "",
    )
    return jsonify({"message": "Saved prompt"}), 200


@app.route("/generate_fake_data", methods=["POST"])
def generate_fake_data():
    print("calling generate_fake_data...")
    design_hypothesis = read_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    data = get_generated_fake_data(design_hypothesis)
    faked_data = data
    create_and_write_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.FAKED_DATA_FILE_NAME}",
        faked_data,
    )
    return jsonify({"message": "Generated data"}), 200


@app.route("/save_faked_data", methods=["POST"])
def save_faked_data():
    print("calling save_faked_data...")
    faked_data = request.json["faked_data"]
    create_and_write_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.FAKED_DATA_FILE_NAME}",
        faked_data,
    )
    return jsonify({"message": "Saved faked data"}), 200


@app.route("/get_faked_data", methods=["GET"])
def get_faked_data():
    print("calling get_faked_data...")
    faked_data = read_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.FAKED_DATA_FILE_NAME}"
    )
    return (
        jsonify({"message": "getting faked data", "faked_data": faked_data}),
        200,
    )


@app.route("/generate_design_hypothesis", methods=["POST"])
def generate_design_hypothesis():
    print("calling generate_design_hypothesis...")
    prompt = read_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.PROMPT_FILE_NAME}"
    )
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    faked_data = read_file(f"{folder_path}/{globals.FAKED_DATA_FILE_NAME}")
    design_hypothesis = get_generated_design_hypothesis(prompt, faked_data)
    task_map_json = (
        json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
        if file_exists(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}")
        else {}
    )
    task_map = {int(key): value for key, value in task_map_json.items()}
    if folder_exists(f"{folder_path}/1"):
        wipeout_code(folder_path, 1, task_map, globals.current_theory_and_paradigm)
    create_and_write_file(
        f"{folder_path}/{globals.PROMPT_FILE_NAME}",
        prompt,
    )
    create_and_write_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}",
        design_hypothesis,
    )
    return (
        jsonify(
            {
                "message": "Generated design hypothesis",
                "hypothesis": design_hypothesis,
            }
        ),
        200,
    )


@app.route("/save_design_hypothesis", methods=["POST"])
def save_design_hypothesis():
    print("calling save_design_hypothesis...")
    data = request.json
    design_hypothesis = data["design_hypothesis"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = (
        json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
        if file_exists(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}")
        else {}
    )
    task_map = {int(key): value for key, value in task_map_json.items()}
    if folder_exists(f"{folder_path}/1"):
        wipeout_code(folder_path, 1, task_map, globals.current_theory_and_paradigm)
    create_and_write_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}",
        design_hypothesis,
    )
    return (
        jsonify({"message": "Saved design hypothesis", "data": design_hypothesis}),
        200,
    )


@app.route("/get_design_hypothesis", methods=["GET"])
def get_design_hypothesis():
    print("calling get_design_hypothesis...")
    design_hypothesis = read_file(
        f"{globals.folder_path}/{globals.current_theory_and_paradigm}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    return (
        jsonify(
            {
                "message": "getting design hypothesis",
                "design_hypothesis": design_hypothesis,
            }
        ),
        200,
    )


@app.route("/generate_plan", methods=["POST"])
def generate_plan():
    print("calling generate_plan...")
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    design_hypothesis = read_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    plan = get_generated_plan(design_hypothesis)
    task_map_json = (
        json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
        if file_exists(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}")
        else {}
    )
    task_map = {int(key): value for key, value in task_map_json.items()}
    if folder_exists(f"{folder_path}/1"):
        wipeout_code(folder_path, 1, task_map, globals.current_theory_and_paradigm)
    task_map = {
        int(task["task_id"]): {
            "task": task["task"],
            globals.CURRENT_DEBUG_ITERATION: 0,
            globals.DEBUG_ITERATION_MAP: {},
        }
        for task in plan
    }
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    print(task_map)
    return jsonify({"message": "Generated Plan", "plan": plan}), 200


@app.route("/get_plan", methods=["GET"])
def get_plan():
    print("calling get_plan...")
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    plan = get_plan_from_task_map(folder_path)
    return jsonify({"message": "getting plan", "plan": plan}), 200


@app.route("/update_step_in_plan", methods=["POST"])
def update_step_in_plan():
    print("calling update_step_in_plan")
    data = request.json
    task_id = int(data["task_id"])
    new_task_description = data["task_description"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    task_map[task_id]["task"] = new_task_description
    if folder_exists(f"{folder_path}/{task_id}"):
        wipeout_code(
            folder_path, task_id, task_map, globals.current_theory_and_paradigm
        )
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    plan = json.loads(get_plan_from_task_map(folder_path))
    return (
        jsonify({"message": f"Updated step in plan for {task_id}", "data": plan}),
        200,
    )


@app.route("/add_step_in_plan", methods=["POST"])
def add_step_in_plan():
    print("calling add_step_in_plan")
    data = request.json
    curr_task_id = int(data["current_task_id"])
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    new_task_id = curr_task_id + 1
    new_task_description = data["new_task_description"]
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    keys_to_shift = sorted(
        [key for key in task_map if key >= new_task_id], reverse=True
    )
    for key in keys_to_shift:
        task_map[key + 1] = task_map.pop(key)
    task_map[new_task_id] = {
        "task": new_task_description,
        globals.CURRENT_DEBUG_ITERATION: 0,
        globals.DEBUG_ITERATION_MAP: {},
    }
    task_map = {key: task_map[key] for key in sorted(task_map)}
    if folder_exists(f"{folder_path}/{new_task_id}"):
        wipeout_code(
            folder_path, new_task_id, task_map, globals.current_theory_and_paradigm
        )
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    plan = json.loads(get_plan_from_task_map(folder_path))
    return (
        jsonify({"message": f"Added step in plan for {new_task_id}", "data": plan}),
        200,
    )


@app.route("/remove_step_in_plan", methods=["POST"])
def remove_step_in_plan():
    print("calling remove_step_in_plan")
    data = request.json
    task_id = int(data["task_id"])
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    task_map.pop(task_id)
    keys_to_shift = sorted([key for key in task_map if key > task_id])
    for key in keys_to_shift:
        task_map[key - 1] = task_map.pop(key)
    if folder_exists(f"{folder_path}/{task_id}"):
        wipeout_code(
            folder_path, task_id, task_map, globals.current_theory_and_paradigm
        )
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    plan = json.loads(get_plan_from_task_map(folder_path))
    return (
        jsonify({"message": f"Removed step in plan for {task_id}", "data": plan}),
        200,
    )


# For testing only. Run curl http://127.0.0.1:5000/generate_code
@app.route("/generate_code", methods=["POST"])
def generate_code():
    print("calling generate_code...")
    data = request.json
    task_id = int(data["task_id"])
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_code_folder_path = f"{folder_path}/{task_id}"
    design_hypothesis = read_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    if folder_exists(task_code_folder_path):
        wipeout_code(
            folder_path, task_id, task_map, globals.current_theory_and_paradigm
        )
    faked_data = read_file(f"{folder_path}/{globals.FAKED_DATA_FILE_NAME}")
    plan = json.loads(get_plan_from_task_map(folder_path))
    implement_plan_lock_step(design_hypothesis, plan, folder_path, task_id, faked_data)
    task_main_code_folder_path = (
        f"{folder_path}/{task_id}/{globals.MAIN_CODE_FILE_NAME}"
    )
    code = read_file(task_main_code_folder_path)
    return jsonify({"message": "Generated code", "code": code}), 200


@app.route("/get_code_per_step", methods=["GET"])
def get_code_per_step():
    print("calling get_code_per_step...")
    task_id = request.args.get("task_id")
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_main_code_folder_path = (
        f"{folder_path}/{task_id}/{globals.MAIN_CODE_FILE_NAME}"
    )
    code = read_file(task_main_code_folder_path) or ""
    return jsonify({"message": f"grabbed code for {task_id}", "code": code}), 200


@app.route("/get_iteration_map_per_step", methods=["GET"])
def get_iteration_map_per_step():
    print("calling get_iteration_map_per_step...")
    task_id = int(request.args.get("task_id"))
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    print(task_map[task_id][globals.DEBUG_ITERATION_MAP])
    return (
        jsonify(
            {
                "message": f"grabbed iteration_map for {task_id}",
                "iterations": task_map[task_id][globals.DEBUG_ITERATION_MAP],
            }
        ),
        200,
    )


@app.route("/get_code_per_step_per_iteration", methods=["GET"])
def get_code_per_step_per_iteration():
    print("calling get_code_per_step_per_iteration...")
    task_id = request.args.get("task_id")
    iteration = request.args.get("iteration")
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    code_folder_path = ""
    if iteration == "0":
        code_folder_path = f"{folder_path}/{task_id}/{globals.CLEANED_CODE_FILE_NAME}"
    else:
        code_folder_path = f"{folder_path}/{task_id}/{globals.ITERATION_FOLDER_NAME}/{iteration}/{globals.ITERATION_CLEANED_FILE_NAME}"
    code = read_file(code_folder_path) or ""
    create_and_write_file(
        f"{folder_path}/{task_id}/{globals.MAIN_CODE_FILE_NAME}", code
    )
    return (
        jsonify(
            {
                "message": f"grabbed code for {task_id} and iteration {iteration}",
                "code": code,
            }
        ),
        200,
    )


@app.route("/delete_code_per_step_per_iteration", methods=["POST"])
def delete_code_per_step_per_iteration():
    print("calling delete_code_per_step_per_iteration...")
    data = request.json
    task_id = int(data["task_id"])
    iteration = data["iteration"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    task_map[task_id][globals.DEBUG_ITERATION_MAP].pop(iteration, None)
    print(
        f"after, task id {task_id} iteration {iteration}, {task_map[task_id][globals.DEBUG_ITERATION_MAP]}"
    )
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    return jsonify({"message": f"deleted iteration for {task_id} {iteration}"}), 200


@app.route("/save_code_per_step", methods=["POST"])
def save_code_per_step():
    print("calling get_code_per_step...")
    data = request.json
    task_id = data["task_id"]
    code = data["code"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_main_code_folder_path = (
        f"{folder_path}/{task_id}/{globals.MAIN_CODE_FILE_NAME}"
    )
    create_and_write_file(task_main_code_folder_path, code)
    print(code)
    return jsonify({"message": f"Grabbed code for {task_id}", "code": code}), 200


@app.route("/iterate_code", methods=["POST"])
def iterate_code():
    print("calling iterate_code...")
    data = request.json
    task_id = data["task_id"]
    problem = data["problem"]
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    task_map_json = json.loads(read_file(f"{folder_path}/{globals.TASK_MAP_FILE_NAME}"))
    task_map = {int(key): value for key, value in task_map_json.items()}
    task_map[task_id][globals.CURRENT_DEBUG_ITERATION] = (
        task_map[task_id][globals.CURRENT_DEBUG_ITERATION] + 1
    )
    faked_data = read_file(
        f"{folder_path}/{globals.FAKED_DATA_FILE_NAME}",
    )
    current_debug_iteration = task_map[task_id][globals.CURRENT_DEBUG_ITERATION]
    task_map[task_id][globals.DEBUG_ITERATION_MAP][
        str(current_debug_iteration)
    ] = problem
    print(task_map)
    create_and_write_file(
        f"{folder_path}/{globals.TASK_MAP_FILE_NAME}",
        json.dumps(task_map),
    )
    task = task_map[task_id]["task"]
    task_code_folder_path = f"{folder_path}/{task_id}"
    current_iteration_folder_path = f"{task_code_folder_path}/{globals.ITERATION_FOLDER_NAME}/{current_debug_iteration}"
    create_folder(current_iteration_folder_path)
    design_hypothesis = read_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    get_iterate_code(
        problem,
        task,
        task_code_folder_path,
        current_iteration_folder_path,
        design_hypothesis,
        faked_data,
    )
    return (
        jsonify(
            {
                "message": "Debugged and regenerated code",
                "current_iteration": task_map[task_id][globals.CURRENT_DEBUG_ITERATION],
            }
        ),
        200,
    )


@app.route("/get_test_cases_per_lock_step", methods=["GET"])
def get_test_cases_per_lock_step():
    print("calling get_test_cases_per_lock_step...")
    task_id = int(request.args.get("task_id"))
    folder_path = f"{globals.folder_path}/{globals.current_theory_and_paradigm}"
    index = task_id - 1
    plan = json.loads(read_file(f"{folder_path}/{globals.PLAN_FILE_NAME}"))
    task = plan[index]["task"]
    design_hypothesis = read_file(
        f"{folder_path}/{globals.DESIGN_HYPOTHESIS_FILE_NAME}"
    )
    test_cases = test_code_per_lock_step(task, design_hypothesis)
    return (
        jsonify(
            {
                "message": f"Grabbed test cases for {task_id} {task}",
                "test_cases": json.loads(test_cases),
            }
        ),
        200,
    )


# For testing only. Run curl http://127.0.0.1:5000/set_globals_for_uuid/uuid
@app.route("/set_globals_for_uuid/<generated_uuid>", methods=["GET"])
def set_globals_for_uuid(generated_uuid):
    print("calling set_globals_for_uuid")
    globals.folder_path = f"{globals.GENERATED_FOLDER_PATH}/{generated_uuid}"
    globals.idea = read_file(f"{globals.folder_path}/{globals.IDEA_FILE_NAME}")
    globals.user = read_file(f"{globals.folder_path}/{globals.USER_FILE_NAME}")
    globals.goal = read_file(f"{globals.folder_path}/{globals.GOAL_FILE_NAME}")
    globals.theories_and_paradigms = (
        json.loads(
            read_file(
                f"{globals.folder_path}/{globals.THEORIES_AND_PARADIGMS_FILE_NAME}"
            )
        )
        if file_exists(
            f"{globals.folder_path}/{globals.THEORIES_AND_PARADIGMS_FILE_NAME}"
        )
        else {}
    )
    return jsonify({"message": "Successfully set global fields"}), 200


# Running app
if __name__ == "__main__":
    app.run(debug=True)
