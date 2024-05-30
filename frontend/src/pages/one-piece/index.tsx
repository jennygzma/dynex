// Filename - App.js

// Importing modules
import React, { useState } from "react";
import NewsFeed from "./components/facebook/news-feed";
import { onePieceData } from "./components/type";
import { Stack, Typography, Button } from "@mui/material";
import Table from "./components/gmail/table";
import Tinder from "./components/tinder/tinder";

const OnePiece = () => {
  const [uiType, setUiType] = useState(undefined);

  return (
    <div className="OnePiece">
      <Stack
        spacing="30px"
        sx={{
          alignItems: "center",
          backgroundColor: "#fadfaa",
          height: "100vh",
          overflow: "auto",
          padding: "20px",
          paddingTop: "40px",
        }}
      >
        <Typography
          variant="h3"
          fontFamily="monospace"
          fontWeight="bold"
          color="#c78016"
        >
          visualize ui prototype
        </Typography>
        <Stack direction="row" spacing="10px" sx={{ alignItems: "center" }}>
          <Typography
            variant="h5"
            fontFamily="monospace"
            fontWeight="bold"
            color="#c78016"
          >
            manual mui
          </Typography>
          <Button
            onClick={() => setUiType("cardSwipe")}
            sx={{
              border: "solid 3px #ffc054",
              backgroundColor: uiType === "cardSwipe" ? "#ffc054" : "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
              color: "#c78016",
              fontFamily: "monospace",
            }}
          >
            card swipe
          </Button>
          <Button
            onClick={() => setUiType("newsFeed")}
            sx={{
              border: "solid 3px #ffc054",
              backgroundColor: uiType === "newsFeed" ? "#ffc054" : "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
              color: "#c78016",
              fontFamily: "monospace",
            }}
          >
            news feed
          </Button>
          <Button
            onClick={() => setUiType("table")}
            sx={{
              border: "solid 3px #ffc054",
              backgroundColor: uiType === "table" ? "#ffc054" : "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
              color: "#c78016",
              fontFamily: "monospace",
            }}
          >
            table
          </Button>
        </Stack>
        {/* <Stack direction="row" spacing="10px" sx={{ alignItems: "center" }}>
          <Typography
            variant="h5"
            fontFamily="monospace"
            fontWeight="bold"
            color="#c78016"
          >
            gpt html
          </Typography>
          <Button
            onClick={() => setUiType("html")}
            sx={{
              border: "solid 3px #ffc054",
              backgroundColor: uiType === "html" ? "#ffc054" : "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
              color: "#c78016",
              fontFamily: "monospace",
            }}
          >
            html
          </Button>
        </Stack> */}
        {uiType === "cardSwipe" && <Tinder dataArray={onePieceData} />}
        {uiType === "newsFeed" && (
          <NewsFeed dataArray={onePieceData}></NewsFeed>
        )}
        {uiType === "table" && <Table dataArray={onePieceData} />}
        {/* {uiType === "html" && <GPT dataArray={onePieceData} />}
        {uiType === "html" && <CharacterSwipe />} */}
      </Stack>
    </div>
  );
};

export default OnePiece;
