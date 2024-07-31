import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../hooks/app-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";

const ProjectFormation = () => {
  const {
    updateIsLoading,
    designHypothesis,
    updateDesignHypothesis,
    currentTheory,
  } = useAppContext();

  const [dataInput, setDataInput] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [updatedPrompt, setUpdatedPrompt] = useState(false);
  const [updatedDesignHypothesis, setUpdatedDesignHypothesis] = useState(false);
  const [updatedDataInput, setUpdatedDataInput] = useState(false);

  useEffect(() => {}, [designHypothesis, dataInput, UIPrompt]);
  useEffect(() => {
    if (!currentTheory) return;
    getFakedData();
    getDesignHypothesis();
    getPrompt();
  }, [currentTheory]);

  const getPrompt = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_prompt",
    })
      .then((response) => {
        console.log("/get_prompt request successful:", response.data);
        setUIPrompt(response.data.prompt);
      })
      .catch((error) => {
        console.error("Error calling /get_prompt request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const savePrompt = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_prompt",
      data: {
        prompt: UIPrompt,
      },
    })
      .then((response) => {
        console.log("/save_prompt request successful:", response.data);
        getPrompt();
        setUpdatedPrompt(false);
      })
      .catch((error) => {
        console.error("Error calling /save_prompt request:", error);
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
  if (!currentTheory) return <></>;
  return (
    <Box sx={{ width: "90%" }}>
      <Stack spacing="20px">
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Project Formation
        </Typography>
        <Stack spacing="10px">
          <TextField
            className={"prompt"}
            label="Prompt"
            value={UIPrompt}
            onChange={(e) => {
              setUIPrompt(e.target.value);
              setUpdatedPrompt(true);
            }}
          />
          <Button
            onClick={savePrompt}
            disabled={!updatedPrompt}
            sx={{
              width: "100%",
            }}
          >
            Update Prompt
          </Button>
        </Stack>
        <Stack spacing="10px">
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                alignSelf: "center",
                fontFamily: "monospace",
              }}
            >
              Design Hypothesis
            </Typography>
            <Button
              onClick={generateDesignHypothesis}
              disabled={!UIPrompt}
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
        <Stack spacing="10px" width="100%">
          <Stack spacing="10px">
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                alignSelf: "center",
                fontFamily: "monospace",
              }}
            >
              Fake Data
            </Typography>
            <Button
              onClick={generateFakeData}
              disabled={!UIPrompt || !designHypothesis}
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
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProjectFormation;
