import { Stack, Typography, Button, TextField, Paper } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

// This prototype attempts to prove that GPT-4 is capable of generating impressive UIs
const htmlStringTinder = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tinder-like Character UI</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #ececec; }
        .card { width: 300px; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 20px; padding: 20px; text-align: center; }
        .card img { max-width: 100%; border-radius: 10px; }
        .buttons { text-align: center; margin-top: 20px; }
        button { padding: 10px 20px; margin: 0 10px; border: none; border-radius: 5px; cursor: pointer; }
        .like { background-color: #4CAF50; color: white; }
        .dislike { background-color: #f44336; color: white; }
    </style>
</head>
<body>

<div class="card">
    <img src="" alt="Character Image" id="charImage">
    <h2 id="charTitle"></h2>
    <p id="charDescription"></p>
</div>

<div class="buttons">
    <button class="dislike" onclick="changeCharacter(-1)">Dislike</button>
    <button class="like" onclick="changeCharacter(1)">Like</button>
</div>

<script>
const characters = [
    { title: "Monkey D Luffy", description: "Role: Straw Hat Pirate, Captain. Fun Fact: Is Dumb. Favorite Moment: Helping Nami", imagePath: "luffyImage.jpeg" }, 
    { title: "Roronoa Zoro", description: "Role: Straw Hat Pirate, Right Wing. Fun Fact: Gets Lost. Favorite Moment: Nothing Happened", imagePath: "zoroImage.jpeg" }, 
    { title: "Vinsmoke Sanji", description: "Role: Straw Hat Pirate, Chef, Left Wing. Fun Fact: Nose bleeds. Favorite Moment: Bowing to Zeff", imagePath: "sanjiImage.jpeg" }, 
    { title: "Nami", description: "Role: Straw Hat Pirate, Navigator. Fun Fact: Thief. Favorite Moment: Asking Luffy for help", imagePath: "namiImage.jpeg" }, 
    { title: "Usopp", description: "Role: Straw Hat Pirate, Sniper. Fun Fact: Liar. Favorite Moment: Enies Lobby", imagePath: "usoppImage.jpeg" }, 
    { title: "Tony Tony Chopper", description: "Role: Straw Hat Pirate, Doctor. Fun Fact: Cotton Candy. Favorite Moment: Doctorine Arc", imagePath: "chopperImage.jpeg" }, 
    { title: "Nico Robin", description: "Role: Straw Hat Pirate, Archaeologist. Fun Fact: Randomly got pale. Favorite Moment: One day you will find friends", imagePath: "robinImage.jpeg" }, 
    { title: "Franky", description: "Role: Straw Hat Pirate, Shipwright. Fun Fact: Coca Cola. Favorite Moment: Stopping train", imagePath: "frankyImage.jpeg" }, 
    { title: "Brook", description: "Role: Straw Hat Pirate, Musician. Fun Fact: .... Favorite Moment: Bink's Sake", imagePath: "brookImage.jpeg" }, 
    { title: "Shanks", description: "Role: Red-Haired Pirate, Captain. Fun Fact: Is Cool. Favorite Moment: Saving Luffy", imagePath: "shanksImage.jpeg" }
];

let currentIndex = 0;

function displayCharacter(index) {
    const { title, description, imagePath } = characters[index];
    document.getElementById('charImage').src = imagePath; // Placeholder, replace with actual paths or URLs
    document.getElementById('charImage').alt = title;
    document.getElementById('charTitle').innerText = title;
    document.getElementById('charDescription').innerText = description;
}

function changeCharacter(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = characters.length - 1;
    if (currentIndex >= characters.length) currentIndex = 0;
    displayCharacter(currentIndex);
}

displayCharacter(currentIndex);
</script>

</body>
</html>`;

const FistUxProto = () => {
  const [dataInput, setDataInput] = useState("");
  const [dataModel, setDataModel] = useState("");
  const [UIPrompt, setUIPrompt] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const renderUI = () => {
    const output = document.getElementById("output");
    output.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "100%";
    output.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(codeInput);
    doc.close();
  };

  const generateCode = () => {
    axios({
      method: "POST",
      url: "/generate_code",
      data: {
        ui_prompt: UIPrompt,
        data_input: dataInput,
      },
    })
      .then((response) => {
        console.log("/generate_code request successful:", response.data);
        setCodeInput(response.data.code);
      })
      .catch((error) => {
        console.error("Error calling /generate_code request:", error);
      });
  };

  const generateFakeData = () => {
    axios({
      method: "POST",
      url: "/generate_fake_data",
      data: {
        data_model_prompt: dataModel,
      },
    })
      .then((response) => {
        console.log("/generate_fake_data request successful:", response.data);
        setDataInput(response.data.fake_data);
      })
      .catch((error) => {
        console.error("Error calling /generate_fake_data request:", error);
      });
  };
  return (
    <div className={"hi"}>
      <Stack spacing="20px" sx={{ padding: "20px" }}>
        <Stack
          direction="row"
          spacing="20px"
          sx={{
            alignItems: "flex-start",
            alignContent: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* <img
            src={require("../../assets/chopper-icon.ico")}
            alt="chopper"
            width="150x"
          /> */}
          <Typography variant="h1" sx={{ alignSelf: "center" }}>
            UX Prototype
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing="100px"
          sx={{ alignContent: "stretch", paddingX: "100px" }}
        >
          <Stack spacing="20px" width="30%">
            <TextField
              className={"hi"}
              label="User Interaction"
              variant="outlined"
              multiline
              rows={10}
              value={UIPrompt}
              onChange={(e) => setUIPrompt(e.target.value)}
            />
            <TextField
              className={"hi"}
              label="Data Model"
              variant="outlined"
              multiline
              rows={10}
              value={dataModel}
              onChange={(e) => setDataModel(e.target.value)}
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generateFakeData}
            >
              Generate fake data
            </Button>
            <TextField
              className={"hi"}
              label="Data Input"
              variant="outlined"
              multiline
              rows={10}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
            {/* <TextField
              className={"hi"}
              label="Style"
              variant="outlined"
              multiline
              rows={10}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            /> */}
            <Button variant="contained" color="primary" onClick={generateCode}>
              Generate UI Code
            </Button>
          </Stack>
          <Stack spacing="20px" width="70%" height="100%">
            <p>Edit your HTML and JavaScript code below:</p>
            <TextField
              className={"hi"}
              label="Code Editor"
              variant="outlined"
              multiline
              rows={10}
              value={codeInput}
              placeholder={htmlStringTinder}
              onChange={(e) => setCodeInput(e.target.value)}
              inputProps={{ style: { fontFamily: "monospace" } }}
            />
            <Button variant="contained" color="primary" onClick={renderUI}>
              Render
            </Button>
            <Paper id="output" className={"hi"} sx={{ height: "100vh" }} />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default FistUxProto;
