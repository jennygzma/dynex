import { Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlanContext } from "../hooks/plan-context";
import Button from "../../../components/Button";
import TextField from "../../../components/TextField";
import Box from "../../../components/Box";
import * as MUI from '@mui/material';

const generatedCode = `
function CardComponent({ MUI }) {
  const { Card, CardContent, Typography } = MUI;

  let data = [
    {
        "id": 1,
        "itemName": "Milk",
        "description": "1 litre fresh cow milk",
        "price": 3.5,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Dairy Products",
        "stock": 150
    },
    {
        "id": 2,
        "itemName": "Eggs",
        "description": "12 fresh chicken eggs pack",
        "price": 2,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Poultry",
        "stock": 500
    },
    {
        "id": 3,
        "itemName": "Bread",
        "description": "Whole wheat bread",
        "price": 1.5,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Bakery",
        "stock": 75
    },
    {
        "id": 4,
        "itemName": "Apples",
        "description": "One pound of organic apples",
        "price": 1,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Fruits",
        "stock": 100
    },
    {
        "id": 5,
        "itemName": "Carrots",
        "description": "Organic fresh carrots - 1 pound",
        "price": 0.8,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Vegetables",
        "stock": 80
    },
    {
        "id": 6,
        "itemName": "Rice",
        "description": "Long grain basmati rice - 5 kg",
        "price": 8,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Staples",
        "stock": 50
    },
    {
        "id": 7,
        "itemName": "Pasta",
        "description": "Italian pasta - 1 kg",
        "price": 2,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Pastas and Noodles",
        "stock": 70
    },
    {
        "id": 8,
        "itemName": "Olive Oil",
        "description": "Extra virgin olive oil - 500ml",
        "price": 5,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Oils and Vinegars",
        "stock": 60
    },
    {
        "id": 9,
        "itemName": "Cheese",
        "description": "Mozzarella Cheese - 200g",
        "price": 3,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Dairy Products",
        "stock": 100
    },
    {
        "id": 10,
        "itemName": "Chips",
        "description": "Potato chips - 200g",
        "price": 1,
        "isAddedToCart": false,
        "isBought": false,
        "category": "Snacks",
        "stock": 200
    }
  ];

  return (
    <div>
      {data.map((item, index) => (
        <Card key={index} sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.itemName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {'Price: $' + item.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {'Category: ' + item.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {'Stock: ' + item.stock}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

module.exports = CardComponent;
`;
const CodeGeneration = () => {
  const {
    updateIsLoading,
    plan,
    designHypothesis,
    currentTask,
    currentIteration,
    updateCurrentIteration,
  } = usePlanContext();
  const [code, setCode] = useState("");
  const [updatedCode, setUpdatedCode] = useState(false);
  const [problemDescription, setProblemDescription] = useState(undefined);
  const [clickedRender, setClickedRender] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  console.log("hi jenny componnent", Component)
  // const renderUI = () => {
  //   const output = document.getElementById("output");
  //   output.innerHTML = "";
  //   const iframe = document.createElement("iframe");
  //   iframe.width = "100%";
  //   iframe.height = "100%";
  //   output.appendChild(iframe);
  //   const doc = iframe.contentWindow.document;
  //   doc.open();
  //   doc.write(code);
  //   doc.close();
  // };

  const saveCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/save_code_per_step",
      data: {
        task_id: currentTask.taskId,
        code: code,
      },
    })
      .then((response) => {
        console.log("/save_code_per_step request successful:", response.data);
        getCode();
        setUpdatedCode(false);
      })
      .catch((error) => {
        console.error("Error calling /save_code_per_step request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const getCode = () => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_code_per_step",
      params: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/get_code_per_step request successful:", response.data);
        setCode(response.data.code);
        const DynamicComponent = new Function('React', 'MUI', `return ${generatedCode}`)(React, MUI);
        console.log("hi jenny dynamic Component", DynamicComponent);
        setComponent(() => DynamicComponent);
      })
      .catch((error) => {
        console.error("Error calling /get_code_per_step request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };
  const renderGeneratedComponent = () => {
    // Evaluate the generated code as JavaScript
    const CardComponent = new Function('React', 'MUI', `
      return (${generatedCode});
    `)(React, MUI); // Ensure MUI components are provided
    return <CardComponent MUI={MUI} />;
  };

  const getCodeForIteration = (iteration: number) => {
    updateIsLoading(true);
    axios({
      method: "GET",
      url: "/get_code_per_step_per_iteration",
      params: {
        task_id: currentTask.taskId,
        iteration: iteration,
      },
    })
      .then((response) => {
        console.log(
          "/get_code_per_step_per_iteration request successful:",
          response.data,
        );
        setCode(response.data.code);
      })
      .catch((error) => {
        console.error(
          "Error calling /get_code_per_step_per_iteration request:",
          error,
        );
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const generateCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/generate_code",
      data: {
        task_id: currentTask.taskId,
      },
    })
      .then((response) => {
        console.log("/generate_code request successful:", response.data);
        getCode();
      })
      .catch((error) => {
        console.error("Error calling /generate_code request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  const iterateCode = () => {
    updateIsLoading(true);
    axios({
      method: "POST",
      url: "/iterate_code",
      data: {
        task_id: currentTask.taskId,
        problem: problemDescription,
      },
    })
      .then((response) => {
        console.log("/iterate_code request successful:", response.data);
        setProblemDescription("");
        updateCurrentIteration(response.data.current_iteration);
      })
      .catch((error) => {
        console.error("Error calling /iterate_code request:", error);
      })
      .finally(() => {
        updateIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentTask === undefined) return;
    getCode();
    getCodeForIteration(currentIteration);
    setProblemDescription("");
    setClickedRender(false);
  }, [plan, designHypothesis, currentTask, currentIteration]);

  if (!designHypothesis) return <></>;
  return (
    <Box sx={{ width: "75%" }}>
      <Stack spacing="10px">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            alignSelf: "center",
            fontFamily: "monospace",
          }}
        >
          Implementation
        </Typography>
        <Button
          onClick={generateCode}
          sx={{
            width: "100%",
          }}
        >
          {code ? "Regenerate Code" : "Generate Code"}
        </Button>
        {code && (
          <>
            <Box
              border={5}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Stack spacing="10px">
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    alignSelf: "center",
                    fontFamily: "monospace",
                  }}
                >
                  Code Editor{" "}
                </Typography>
                <TextField
                  className={"code"}
                  rows={40}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setUpdatedCode(true);
                  }}
                  code={true}
                />
                <Button
                  disabled={!updatedCode}
                  onClick={saveCode}
                  sx={{ width: "100%" }}
                >
                  Update Code
                </Button>
              </Stack>
            </Box>
            <Stack direction="row" spacing="10px">
              <Box
                border={5}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Stack spacing="10px">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      alignSelf: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    Iterate, Debug, or Repair
                  </Typography>
                  <TextField
                    className={"problem"}
                    label="Problem Description"
                    value={problemDescription}
                    onChange={(e) => {
                      setProblemDescription(e.target.value);
                    }}
                  />
                  <Button disabled={!problemDescription} onClick={iterateCode}>
                    Iterate
                  </Button>
                </Stack>
              </Box>
            </Stack>
            <Button
              disabled={!code}
              onClick={() => {
                setClickedRender(true);
              }}
            >
              Render
            </Button>
            {!clickedRender && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  fontFamily: "monospace",
                }}
              >
                Your UI will be rendered here!
              </Typography>
            )}
            <Box border={clickedRender ? 5 : 0}>
              {/* <Paper
                id="output"
                className="output"
                sx={{ height: clickedRender ? "800px" : "0px" }}
              /> */}
              {renderGeneratedComponent()}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CodeGeneration;
