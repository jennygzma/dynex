import React from "react";
import { Stack, Box, Card, Button } from "@mui/material";
import { InfoBlock } from "../type";

const TinderCard = ({
  data,
  onClickBack,
  onClickNext,
}: {
  data: InfoBlock;
  onClickBack: () => void;
  onClickNext: () => void;
}) => {
  return (
    <Card
      sx={{
        width: "400px",
        height: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7e094",
        boxShadow: "#fc8c03",
        border: "solid 4px #ffc054",
      }}
    >
      <Stack
        spacing="20px"
        sx={{
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            border: "solid 1px",
            width: "300px",
            height: "300px",
          }}
        >
          <img
            src={data.imagePath}
            alt="luffy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
        <Stack direction="row" spacing="30px">
          <Button
            onClick={onClickBack}
            sx={{
              // border: "solid 3px #ffc054",
              backgroundColor: "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
            }}
          >
            ⬅️
          </Button>
          <Button
            onClick={onClickNext}
            sx={{
              // border: "solid 3px #ffc054",
              backgroundColor: "#fad993",
              "&:hover": {
                backgroundColor: "#ffc054",
              },
            }}
          >
            ➡️
          </Button>
        </Stack>
        <Box
          sx={{
            //border: "solid 3px #ffc054",
            borderRadius: "3px",
            width: "300px",
            height: "150px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fad993",
            fontFamily: "monospace",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{data.title}</div>
          {Object.entries(data.description).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </Box>
      </Stack>
    </Card>
  );
};

export default TinderCard;
