import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";
import Chip from "../../../components/Chip";

const ProjectFormation = () => {
  const {
    updateIsLoading,
    designHypothesis,
    updateDesignHypothesis,
    theoriesToExplore,
    updateTheoriesToExplore,
  } = useAppContext();

  useEffect(() => {
    getFakedData();
    getDesignHypothesis();
    getUserInput();
    getTheories();
    getSelectedTheories();
  }, []);

  const [dataInput, setDataInput] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [updatedDesignHypothesis, setUpdatedDesignHypothesis] = useState(false);
  const [updatedDataInput, setUpdatedDataInput] = useState(false);
  const [theories, setTheories] = useState([]);
  const [newTheoryInput, setNewTheoryInput] = useState("");
  const [selectedNewTheory, setSelectedNewTheory] = useState(false);

  useEffect(() => {}, [designHypothesis, dataInput]);

  const handleSelectTheory = (theory) => {
    if (!selectedNewTheory) setSelectedNewTheory(true);
    if (theoriesToExplore.includes(theory)) {
      updateTheoriesToExplore(theoriesToExplore.filter((t) => t !== theory));
    } else {
      updateTheoriesToExplore([...theoriesToExplore, theory]);
    }
  };

  const getUserInput = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_user_input",
    })
      .then((response) => {
        console.log("/get_user_input request successful:", response.data);
        setUIPrompt(response.data.user_input);
      })
      .catch((error) => {
        console.error("Error calling /get_user_input request:", error);
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
      data: {
        prompt: UIPrompt,
      },
    })
      .then((response) => {
        console.log("/brainstorm_theories request successful:", response.data);
        getTheories();
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

  const saveTheory = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_theory",
      data: {
        theory: newTheoryInput,
      },
    })
      .then((response) => {
        console.log("/save_theory request successful:", response.data);
        getTheories();
        setNewTheoryInput("");
      })
      .catch((error) => {
        console.error("Error calling /save_theory request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getSelectedTheories = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_selected_theories",
    })
      .then((response) => {
        console.log(
          "/get_selected_theories request successful:",
          response.data,
        );
        updateTheoriesToExplore(response.data.selected_theories);
      })
      .catch((error) => {
        console.error("Error calling /get_selected_theories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveSelectedTheories = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_selected_theories",
      data: {
        selected_theories: theoriesToExplore,
      },
    })
      .then((response) => {
        console.log("/saveSelectedTheories request successful:", response.data);
        getSelectedTheories();
        setSelectedNewTheory(false);
      })
      .catch((error) => {
        console.error("Error calling /saveSelectedTheories request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const generateFakeData = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        prompt: UIPrompt,
      },
    })
      .then((response) => {
        console.log("/generate_fake_data request successful:", response.data);
        getFakedData();
      })
      .catch((error) => {
        console.error("Error calling /generate_fake_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveFakedData = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_faked_data",
      data: {
        faked_data: dataInput,
      },
    })
      .then((response) => {
        console.log("/save_faked_data request successful:", response.data);
        getFakedData();
      })
      .catch((error) => {
        console.error("Error calling /save_faked_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getFakedData = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_faked_data",
    })
      .then((response) => {
        console.log("/get_faked_data request successful:", response.data);
        setDataInput(response.data.faked_data);
        setUpdatedDataInput(false);
      })
      .catch((error) => {
        console.error("Error calling /get_faked_data request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const generateDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_design_hypothesis",
      data: {
        prompt: UIPrompt,
      },
    })
      .then((response) => {
        console.log(
          "/generate_design_hypothesis request successful:",
          response.data,
        );
        getDesignHypothesis();
      })
      .catch((error) => {
        console.error(
          "Error calling /generate_design_hypotheses request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_design_hypothesis",
      data: {
        design_hypothesis: designHypothesis,
      },
    })
      .then((response) => {
        console.log(
          "/save_design_hypothesis request successful:",
          response.data,
        );
        getDesignHypothesis();
      })
      .catch((error) => {
        console.error("Error calling /save_design_hypothesis request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getDesignHypothesis = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_design_hypothesis",
    })
      .then((response) => {
        console.log(
          "/get_design_hypothesis request successful:",
          response.data,
        );
        updateDesignHypothesis(response.data.design_hypothesis);
        setUpdatedDesignHypothesis(false);
      })
      .catch((error) => {
        console.error("Error calling /get_design_hypothesis request:", error);
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
          Project Formation
        </Typography>
        <TextField
          className={"user-input"}
          label="User Input"
          value={UIPrompt}
          onChange={(e) => setUIPrompt(e.target.value)}
        />
        <Button
          onClick={brainstormTheories}
          disabled={!UIPrompt}
          sx={{
            width: "100%",
          }}
        >
          Brainstorm Theories
        </Button>
        {theories.map((theory) => (
          <Chip
            key={theory}
            label={theory}
            onClick={() => handleSelectTheory(theory)}
            selected={theoriesToExplore.includes(theory)}
            clickable
          />
        ))}
        <Stack direction="row" spacing="10px">
          <TextField
            className={"theory"}
            label="Theory"
            value={newTheoryInput}
            onChange={(e) => setNewTheoryInput(e.target.value)}
            sx={{ width: "90%" }}
          />
          <Button
            onClick={saveTheory}
            disabled={!newTheoryInput}
            sx={{
              width: "10%",
            }}
          >
            Submit
          </Button>
        </Stack>
        <Button
          onClick={saveSelectedTheories}
          disabled={!selectedNewTheory || !UIPrompt}
          sx={{
            width: "100%",
          }}
        >
          Explore Theories For Use Case
        </Button>
        <Stack direction="row" spacing="10px" width="100%">
          <Stack spacing="10px" width="50%">
            <Button
              onClick={generateFakeData}
              disabled={!UIPrompt}
              sx={{
                width: "100%",
              }}
            >
              {dataInput ? "Regenerate Fake Data" : "Generate Fake Data"}
            </Button>
            {dataInput !== "null" && dataInput && (
              <>
                <TextField
                  code={true}
                  className={"generated-data"}
                  label="Data Input"
                  variant="outlined"
                  multiline
                  rows={13}
                  value={dataInput}
                  onChange={(e) => {
                    setDataInput(e.target.value);
                    setUpdatedDataInput(true);
                  }}
                />
                <Button onClick={saveFakedData} disabled={!updatedDataInput}>
                  Update faked data
                </Button>
              </>
            )}
          </Stack>
          <Stack spacing="10px" width="50%">
            <Button
              onClick={generateDesignHypothesis}
              disabled={!UIPrompt || !dataInput}
              sx={{
                width: "100%",
              }}
            >
              {designHypothesis
                ? "Generate new design hypothesis"
                : "Generate design hypothesis"}
            </Button>
            {designHypothesis && (
              <>
                <TextField
                  className={"design-hypothesis"}
                  label="Design Hypothesis"
                  rows={13}
                  value={designHypothesis}
                  onChange={(e) => {
                    updateDesignHypothesis(e.target.value);
                    setUpdatedDesignHypothesis(true);
                  }}
                />
                <Button
                  onClick={saveDesignHypothesis}
                  disabled={!updatedDesignHypothesis}
                >
                  Update design hypothesis
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProjectFormation;
