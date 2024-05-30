import React from "react";
import { Stack } from "@mui/material";
import { InfoBlock } from "../type";
import Row from "./row";

const Table = ({ dataArray }: { dataArray: InfoBlock[] }) => {
  return (
    <Stack>
      {dataArray.map((data) => {
        return <Row data={data} />;
      })}
    </Stack>
  );
};

export default Table;
