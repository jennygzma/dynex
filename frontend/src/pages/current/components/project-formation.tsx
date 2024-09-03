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
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ProjectFormation = () => {
  const { updateIsLoading, spec, updateSpec, currentPrototype } =
    useAppContext();

  const [dataInput, setDataInput] = useState("");
  const [dataIteration, setDataIteration] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [updatedPrompt, setUpdatedPrompt] = useState(false);
  const [updatedSpec, setUpdatedSpec] = useState(false);
  const [updatedDataInput, setUpdatedDataInput] = useState(false);
  const [checkedState, setCheckedState] = useState({
    checkedGPT: false,
    checkedImages: false,
    checkedFakedData: false,
    checkedChartJs: false,
    checkedGoJs: false,
  });
  const [updatedCheckBoxes, setUpdatedCheckBoxes] = useState(false);
  const [expand, setExpand] = useState(true);

  const handleChange = (event) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
    setUpdatedCheckBoxes(true);
  };

  useEffect(() => {}, [spec, dataInput, UIPrompt]);
  useEffect(() => {
    if (!currentPrototype) return;
    getFakedData();
    getSpec();
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

  const generateSpec = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_spec",
    })
      .then((response) => {
        console.log("/generate_spec request successful:", response.data);
        getSpec();
        getToolsRequirement();
      })
      .catch((error) => {
        console.error("Error calling /generate_spec request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const saveSpec = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_spec",
      data: {
        spec: spec,
      },
    })
      .then((response) => {
        console.log("/save_spec request successful:", response.data);
        getSpec();
      })
      .catch((error) => {
        console.error("Error calling /save_spec request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getSpec = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_spec",
    })
      .then((response) => {
        console.log("/get_spec request successful:", response.data);
        updateSpec(response.data.spec);
        setUpdatedSpec(false);
      })
      .catch((error) => {
        console.error("Error calling /get_spec request:", error);
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

  useEffect(()=> {

  },[currentPrototype])

  if (!currentPrototype) return <></>;
  if (!expand)
    return (
      <Stack
        direction="row"
        spacing="10px"
        sx={{
          alignItems: "center",
        }}
      >
        <Button colorVariant="red" onClick={() => setExpand(true)}>
          <ExpandMore />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          PROJECT FORMATION
        </Typography>
      </Stack>
    );

  return (
    <Stack spacing="20px">
      <Stack
        direction="row"
        spacing="10px"
        sx={{
          alignItems: "center",
        }}
      >
        <Button colorVariant="red" onClick={() => setExpand(false)}>
          <ExpandLess />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          PROJECT FORMATION
        </Typography>
      </Stack>
      <Stack spacing="10px" direction="row">
        <Stack sx={{ width: checkedState.checkedFakedData ? "33%" : "50%" }}>
          <Button onClick={recommendToolsRequirement}>🧠</Button>
          <FormGroup>
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
                  sx={
                    {
                      // alignSelf: "center",
                      // fontFamily: "monospace",
                    }
                  }
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
                  sx={
                    {
                      // alignSelf: "center",
                      // fontFamily: "monospace",
                    }
                  }
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
                  sx={
                    {
                      // alignSelf: "center",
                      // fontFamily: "monospace",
                    }
                  }
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
                  sx={
                    {
                      // alignSelf: "center",
                      // fontFamily: "monospace",
                    }
                  }
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
                  sx={
                    {
                      // alignSelf: "center",
                      // fontFamily: "monospace",
                    }
                  }
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
        <Stack
          spacing="10px"
          sx={{ width: checkedState.checkedFakedData ? "33%" : "50%" }}
        >
          <Button
            onClick={generateSpec}
            sx={{
              width: "100%",
            }}
          >
            {spec ? "Generate new spec" : "Generate spec"}
          </Button>
          {spec && (
            <>
              <TextField
                className={"design-spec"}
                label="Spec"
                rows={13}
                value={spec}
                onChange={(e) => {
                  updateSpec(e.target.value);
                  setUpdatedSpec(true);
                }}
              />
              <Button onClick={saveSpec} disabled={!updatedSpec}>
                Update spec
              </Button>
            </>
          )}
        </Stack>
        <Stack
          spacing="10px"
          width={checkedState.checkedFakedData ? "33%" : "0%"}
        >
          {checkedState.checkedFakedData && (
            <Stack spacing="10px">
              {/* <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    alignSelf: "center",
                    fontFamily: "monospace",
                  }}
                >
                  Fake Data
                </Typography> */}
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
                disabled={!spec}
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
    </Stack>
  );
};

export default ProjectFormation;
