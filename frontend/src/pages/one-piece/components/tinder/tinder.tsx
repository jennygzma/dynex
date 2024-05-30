import React, { useState } from "react";
import { InfoBlock } from "../type";
import TinderCard from "./tinder-card";

const Tinder = ({ dataArray }: { dataArray: InfoBlock[] }) => {
  const [index, setIndex] = useState(0);

  return (
    <TinderCard
      data={dataArray[index]}
      onClickBack={() =>
        setIndex(index - 1 >= 0 ? index - 1 : dataArray.length - 1)
      }
      onClickNext={() => setIndex(index + 1 < dataArray.length ? index + 1 : 0)}
    />
    // <Stack direction="row" spacing="10px" sx={{
    // 	flexWrap: "nowrap",
    // 	overflowX: "auto"
    // }}>
    //     {dataArray.map((data) => {
    //         return <TinderCard data={data}/>
    //     })}
    // </Stack>
  );
};

export default Tinder;
