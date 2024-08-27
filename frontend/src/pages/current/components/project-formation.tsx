import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
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
    currentPrototype,
  } = useAppContext();

  const [dataInput, setDataInput] = useState("");
  const [dataIteration, setDataIteration] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [updatedPrompt, setUpdatedPrompt] = useState(false);
  const [updatedDesignHypothesis, setUpdatedDesignHypothesis] = useState(false);
  const [updatedDataInput, setUpdatedDataInput] = useState(false);
  const [checkedState, setCheckedState] = useState({
    checkedGPT: false,
    checkedImages: false,
    checkedFakedData: false,
    checkedChartJs: false,
    checkedGoJs: false,
  });
  const [updatedCheckBoxes, setUpdatedCheckBoxes] = useState(false);

  const handleChange = (event) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
    setUpdatedCheckBoxes(true);
  };

  useEffect(() => {}, [designHypothesis, dataInput, UIPrompt]);
  useEffect(() => {
    if (!currentPrototype) return;
    getFakedData();
    getDesignHypothesis();
    getToolsRequirement();
    // getPrompt();
  }, [currentPrototype]);

  // const getPrompt = () => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "GET",
  //     url: "/get_prompt",
  //   })
  //     .then((response) => {
  //       console.log("/get_prompt request successful:", response.data);
  //       setUIPrompt(response.data.prompt);
  //     })
  //     .catch((error) => {
  //       console.error("Error calling /get_prompt request:", error);
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  // const savePrompt = () => {
  //   updateIsLoading(true);
  //   axios({
  //     method: "POST",
  //     url: "/save_prompt",
  //     data: {
  //       prompt: UIPrompt,
  //     },
  //   })
  //     .then((response) => {
  //       console.log("/save_prompt request successful:", response.data);
  //       // getPrompt();
  //       setUpdatedPrompt(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error calling /save_prompt request:", error);
  //     })
  //     .finally(() => {
  //       updateIsLoading(false);
  //     });
  // };

  const generateFakeData = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        user_iteration: dataIteration,
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
    })
      .then((response) => {
        console.log(
          "/generate_design_hypothesis request successful:",
          response.data,
        );
        getDesignHypothesis();
        getToolsRequirement();
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

  const getToolsRequirement = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_tools_requirements",
    })
      .then((response) => {
        console.log(
          "/get_tools_requirements request successful:",
          response.data,
        );
        const gpt = response.data.gpt;
        const images = response.data.images;
        const fakedData = response.data.faked_data;
        const chartJs = response.data.chart_js;
        const goJs = response.data.go_js;
        setCheckedState({
          checkedGPT: gpt,
          checkedImages: images,
          checkedFakedData: fakedData,
          checkedChartJs: chartJs,
          checkedGoJs: goJs,
        });
      })
      .catch((error) => {
        console.error("Error calling /get_tools_requirements request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const setToolsRequirement = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/set_tools_requirements",
      data: {
        gpt: checkedState.checkedGPT,
        images: checkedState.checkedImages,
        faked_data: checkedState.checkedFakedData,
        chart_js: checkedState.checkedChartJs,
        go_js: checkedState.checkedGoJs,
      },
    })
      .then((response) => {
        console.log(
          "/set_tools_requirements request successful:",
          response.data,
        );
        getToolsRequirement();
      })
      .catch((error) => {
        console.error("Error calling /set_tools_requirements request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const recommendToolsRequirement = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/recommend_tools_requirements",
    })
      .then((response) => {
        console.log(
          "/recommend_tools_requirements request successful:",
          response.data,
        );
        getToolsRequirement();
      })
      .catch((error) => {
        console.error(
          "Error calling /recommend_tools_requirements request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  if (!currentPrototype) return <></>;
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
        {/* <Stack spacing="10px">
          <TextField
            className={"prompt"}
            label="Prompt"
            value={UIPrompt}
            rows={8}
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
        </Stack> */}
        <Stack spacing="10px" direction="row">
          <Stack sx={{ width: "50%" }}>
            <Stack direction="row" spacing="5px" sx={{ alignSelf: "center" }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  fontFamily: "monospace",
                }}
              >
                Choose your options:
              </Typography>
              <Button onClick={recommendToolsRequirement}>🧠</Button>
            </Stack>
            <FormGroup
              sx={{
                alignSelf: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedState.checkedGPT}
                    onChange={handleChange}
                    name="checkedGPT"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    GPT
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedState.checkedImages}
                    onChange={handleChange}
                    name="checkedImages"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    Images
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedState.checkedFakedData}
                    onChange={handleChange}
                    name="checkedFakedData"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    Faked Data
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedState.checkedChartJs}
                    onChange={handleChange}
                    name="checkedChartJs"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    ChartJS
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedState.checkedGoJs}
                    onChange={handleChange}
                    name="checkedGoJs"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    GoJS
                  </Typography>
                }
              />
            </FormGroup>
            <Button
              onClick={() => {
                setToolsRequirement();
                setUpdatedCheckBoxes(false);
              }}
              disabled={!updatedCheckBoxes}
            >
              Update Tools Requirement
            </Button>
          </Stack>
          <Stack spacing="10px" sx={{ width: "50%" }}>
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

        <Stack spacing="10px" width="100%">
          {checkedState.checkedFakedData && (
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
              <TextField
                className={"generated-data"}
                label="Data Input Suggestions"
                variant="outlined"
                multiline
                rows={2}
                value={dataIteration}
                onChange={(e) => {
                  setDataIteration(e.target.value);
                }}
              />
              <Button
                onClick={generateFakeData}
                disabled={!designHypothesis}
                sx={{
                  width: "100%",
                }}
              >
                {dataInput
                  ? "Regenerate Placeholder Data"
                  : "Generate Placeholder Data"}
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
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProjectFormation;
