import { Divider, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";
import Chip from "../../../components/Chip";

const mapTheories = (jsonTheories) => {
  return jsonTheories.map((jsonTheory) => {
    return {
      theory: jsonTheory.theory,
      description: jsonTheory.description,
    };
  });
};

const mapParadigms = (jsonParadigms) => {
  return jsonParadigms.map((jsonParadigm) => {
    return {
      paradigm: jsonParadigm.theory,
      description: jsonParadigm.description,
    };
  });
};

const getTheoryDescription = (theory, theories, exampleTheories) => {
  for (const item of theories) {
    if (item.theory === theory) {
      return item.description;
    }
  }
  for (const item of exampleTheories) {
    if (item.theory === theory) {
      return item.description;
    }
  }
};

const UserSpecification = () => {
  const { updateIsLoading, updateTheoriesAndParadigmsToExplore } =
    useAppContext();

  useEffect(() => {
    getIdea();
    getUser();
    getGoal();
    getTheories();
    getTheoriesAndParadigms();
  }, []);

  const [idea, setIdea] = useState("");
  const [user, setUser] = useState("");
  const [goal, setGoal] = useState("");
  const [userExamples, setUserExamples] = useState([]);
  const [goalExamples, setGoalExamples] = useState([]);

  const [submittedIdea, setSubmittedIdea] = useState(false);
  const [submittedUser, setSubmittedUser] = useState(false);
  const [submittedGoal, setSubmittedGoal] = useState(false);

  const ideaSubmitDisabled = !(idea && !submittedIdea);
  const userSubmitDisabled = !(user && !submittedUser);
  const goalSumbmitDisabled = !(goal && !submittedGoal);

  const [theory, setTheory] = useState(""); // currently selected theory
  const [theories, setTheories] = useState([]); // all theories
  const [theoryExamples, setTheoryExamples] = useState([]);
  const theoryDescription = getTheoryDescription(
    theory,
    theories,
    theoryExamples,
  );
  const [newTheoryInput, setNewTheoryInput] = useState("");

  const [paradigms, setParadigms] = useState([]); // all paradigms for theory
  const [paradigmExamples, setParadigmExamples] = useState([]);
  const [newParadigmInput, setNewParadigmInput] = useState("");
  const [selectedNewParadigm, setSelectedNewParadigm] = useState(false);

  useEffect(() => {
    if (theory) getParadigms();
  }, [theory]);

  const handleSelectParadigm = (selectedParadigm) => {
    if (!selectedNewParadigm) setSelectedNewParadigm(true);
    if (paradigms.includes(selectedParadigm)) {
      setParadigms(paradigms.filter((p) => p !== selectedParadigm));
    } else {
      setParadigms([...paradigms, selectedParadigm]);
    }
  };

  const getIdea = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_idea",
    })
      .then((response) => {
        console.log("/get_idea request successful:", response.data);
        setIdea(response.data.idea);
      })
      .catch((error) => {
        console.error("Error calling /get_idea request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveIdea = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_idea",
      data: {
        idea: idea,
      },
    })
      .then((response) => {
        console.log("/save_idea request successful:", response.data);
        setSubmittedIdea(true);
      })
      .catch((error) => {
        console.error("Error calling /save_idea request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getUser = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_user",
    })
      .then((response) => {
        console.log("/get_user request successful:", response.data);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error calling /get_user request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveUser = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_user",
      data: {
        user: user,
      },
    })
      .then((response) => {
        console.log("/save_user request successful:", response.data);
        getUser();
        setSubmittedUser(true);
      })
      .catch((error) => {
        console.error("Error calling /save_user request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormUserExamples = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/brainstorm_user_examples",
    })
      .then((response) => {
        console.log(
          "/brainstorm_user_examples request successful:",
          response.data,
        );
        setUserExamples(response.data.examples);
      })
      .catch((error) => {
        console.error(
          "Error calling /brainstorm_user_examples request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getGoal = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_goal",
    })
      .then((response) => {
        console.log("/get_goal request successful:", response.data);
        setGoal(response.data.goal);
      })
      .catch((error) => {
        console.error("Error calling /get_goal request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveGoal = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_goal",
      data: {
        goal: goal,
      },
    })
      .then((response) => {
        console.log("/save_goal request successful:", response.data);
        getGoal();
        setSubmittedGoal(true);
      })
      .catch((error) => {
        console.error("Error calling /save_goal request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormGoalExamples = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/brainstorm_goal_examples",
    })
      .then((response) => {
        console.log(
          "/brainstorm_goal_examples request successful:",
          response.data,
        );
        setGoalExamples(response.data.examples);
      })
      .catch((error) => {
        console.error(
          "Error calling /brainstorm_goal_examples request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormTheories = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/brainstorm_theories",
    })
      .then((response) => {
        console.log("/brainstorm_theories request successful:", response.data);
        setTheoryExamples([...theoryExamples, ...response.data.examples]);
      })
      .catch((error) => {
        console.error("Error calling /brainstorm_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getTheories = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_theories",
    })
      .then((response) => {
        console.log("/get_theories request successful:", response.data);
        setTheories(response.data.theories);
      })
      .catch((error) => {
        console.error("Error calling /get_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const brainstormParadigms = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/brainstorm_ui_paradigms",
      params: {
        theory: theory,
      },
    })
      .then((response) => {
        console.log(
          "/brainstorm_ui_paradigms request successful:",
          response.data,
        );
        setParadigmExamples([...paradigmExamples, ...response.data.examples]);
      })
      .catch((error) => {
        console.error("Error calling /brainstorm_ui_paradigms request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getParadigms = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_ui_paradigms",
      params: {
        theory: theory,
      },
    })
      .then((response) => {
        console.log("/get_ui_paradigms request successful:", response.data);
        setParadigms(response.data.paradigms);
      })
      .catch((error) => {
        console.error("Error calling /get_ui_paradigms request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getTheoriesAndParadigms = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_theories_and_paradigms",
    })
      .then((response) => {
        console.log(
          "/get_theories_and_paradigms request successful:",
          response.data,
        );
        updateTheoriesAndParadigmsToExplore(
          response.data.theories_and_paradigms,
        );
      })
      .catch((error) => {
        console.error(
          "Error calling /get_theories_and_paradigms request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveSelectedTheoryAndParadigms = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_selected_theory_and_paradigms",
      data: {
        theory: theory,
        paradigms: paradigms,
        theoryDescription: theoryDescription,
      },
    })
      .then((response) => {
        console.log(
          "/save_selected_theory_and_paradigms request successful:",
          response.data,
        );
        getTheoriesAndParadigms();
      })
      .catch((error) => {
        console.error(
          "Error calling /save_selected_theory_and_paradigms request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  return (
    <Box>
      <Stack spacing="20px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          User Specification
        </Typography>
        <Stack spacing="10px">
          <Stack spacing="5px">
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              What is your idea? You can express this vaguely, such as "Learning
              Chinese" or "Create a Journaling App" or "Find a Nail Salon in
              NYC"
            </Typography>
            <Stack direction="row" spacing="10px">
              <TextField
                className={"idea"}
                label="Idea"
                value={idea}
                rows={1}
                onChange={(e) => {
                  setIdea(e.target.value);
                  setSubmittedIdea(false);
                }}
              />
              <Button
                onClick={saveIdea}
                disabled={ideaSubmitDisabled}
                sx={{
                  width: "10%",
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
          <Stack spacing="5px">
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              Who is the user that it is for?
            </Typography>
            <Stack direction="row" spacing="20px">
              <Stack direction="row" spacing="10px" sx={{ width: "100%" }}>
                <Button
                  onClick={brainstormUserExamples}
                  disabled={!idea}
                  sx={{
                    width: "100%",
                  }}
                >
                  Brainstorm Examples
                </Button>
                {userExamples.map((userExample) => (
                  <Tooltip key={userExample} title={userExample}>
                    <Chip
                      key={userExample}
                      label={userExample}
                      onClick={() => setUser(userExample)}
                      selected={userExample === user}
                      sx={{ maxWidth: "200px" }}
                      clickable
                    />
                  </Tooltip>
                ))}
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ bgcolor: "#9a4e4e", borderWidth: "4px" }}
              />
              <Stack direction="row" spacing="10px" sx={{ width: "100%" }}>
                <TextField
                  className={"user"}
                  label="User"
                  value={user}
                  rows={1}
                  onChange={(e) => {
                    setUser(e.target.value);
                    setSubmittedUser(false);
                  }}
                />
                <Button
                  onClick={saveUser}
                  disabled={userSubmitDisabled}
                  sx={{
                    width: "10%",
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing="5px">
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              What is the key problem that you want to solve? What is the goal
              of the application?
            </Typography>
            <Stack direction="row" spacing="20px">
              <Stack direction="row" spacing="10px" sx={{ width: "100%" }}>
                <Button
                  onClick={brainstormGoalExamples}
                  disabled={!idea || !user}
                  sx={{
                    width: "100%",
                  }}
                >
                  Brainstorm Examples
                </Button>
                {goalExamples.map((goalExample) => (
                  <Tooltip key={goalExample} title={goalExample}>
                    <Chip
                      key={goalExample}
                      label={goalExample}
                      onClick={() => setGoal(goalExample)}
                      selected={goalExample === goal}
                      clickable
                      sx={{ maxWidth: "200px" }}
                    />
                  </Tooltip>
                ))}
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ bgcolor: "#9a4e4e", borderWidth: "4px" }}
              />
              <Stack direction="row" spacing="10px" sx={{ width: "100%" }}>
                <TextField
                  className={"goal"}
                  label="Goal"
                  value={goal}
                  rows={1}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setSubmittedGoal(false);
                  }}
                />
                <Button
                  onClick={saveGoal}
                  disabled={goalSumbmitDisabled}
                  sx={{
                    width: "10%",
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing="15px">
          <Stack spacing="5px" sx={{ width: "100%" }}>
            <Button
              onClick={brainstormTheories}
              disabled={!idea || !user || !goal}
              sx={{
                width: "100%",
              }}
            >
              Brainstorm Theories
            </Button>
            {theoryExamples.map((theoryExample) => {
              return (
                <Tooltip
                  key={theoryExample.theory}
                  title={theoryExample.description}
                >
                  <Chip
                    key={theoryExample.theory}
                    label={theoryExample.theory}
                    onClick={() => setTheory(theoryExample.theory)}
                    selected={theory === theoryExample.theory}
                    clickable
                  />
                </Tooltip>
              );
            })}
            {theories.map((t) =>
              theoryExamples.includes(t) ? (
                <></>
              ) : (
                <Tooltip key={t.theory} title={t.description}>
                  <Chip
                    key={t.theory}
                    label={t.theory}
                    onClick={() => {
                      setTheory(t.theory);
                    }}
                    selected={theory === t.theory}
                    clickable
                  />
                </Tooltip>
              ),
            )}
            <Stack direction="row" spacing="10px">
              <TextField
                className={"theory"}
                label="Theory"
                value={newTheoryInput}
                rows={1}
                onChange={(e) => setNewTheoryInput(e.target.value)}
                sx={{ width: "90%" }}
              />
              <Button
                onClick={() =>
                  setTheoryExamples([
                    ...theoryExamples,
                    { theory: newTheoryInput, description: "" },
                  ])
                }
                disabled={!newTheoryInput}
                sx={{
                  width: "10%",
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
          <Stack spacing="5px" sx={{ width: "100%" }}>
            <Button
              onClick={brainstormParadigms}
              disabled={!theory}
              sx={{
                width: "100%",
              }}
            >
              Brainstorm UI Paradigms
            </Button>
            {paradigmExamples?.map((paradigmExample) => (
              <Tooltip
                key={paradigmExample.paradigm}
                title={paradigmExample.description}
              >
                <Chip
                  key={paradigmExample.paradigm}
                  label={paradigmExample.paradigm}
                  onClick={() => handleSelectParadigm(paradigmExample)}
                  selected={paradigms?.includes(paradigmExample)}
                  clickable
                />
              </Tooltip>
            ))}
            {paradigms?.map((p) =>
              paradigmExamples.includes(p) ? (
                <></>
              ) : (
                <Tooltip key={p.paradigm} title={p.description}>
                  <Chip
                    key={p.paradigm}
                    label={p.paradigm}
                    selected
                    clickable
                  />
                </Tooltip>
              ),
            )}
            <Stack direction="row" spacing="10px">
              <TextField
                className={"paradigm"}
                label="UI paradigm"
                value={newParadigmInput}
                rows={1}
                onChange={(e) => setNewParadigmInput(e.target.value)}
                sx={{ width: "90%" }}
              />
              <Button
                onClick={() =>
                  setParadigms([
                    ...paradigms,
                    { paradigm: newParadigmInput, description: "" },
                  ])
                }
                disabled={!newParadigmInput}
                sx={{
                  width: "10%",
                }}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Button
          onClick={saveSelectedTheoryAndParadigms}
          disabled={!selectedNewParadigm || !idea}
          sx={{
            width: "100%",
          }}
        >
          Explore Theories and Paradigms For Use Case
        </Button>
      </Stack>
    </Box>
  );
};

export default UserSpecification;
