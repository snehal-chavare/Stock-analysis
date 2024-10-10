import React, { useEffect, useState } from "react";
import moment from "moment";
import GraphProvider from "../GraphProvider/GraphProvider";
import "./DataFormation.css";

const DataFormation = ({
  fileContent,
  key,
  tohours,
  tominutes,
  toseconds,
  fromhours,
  fromminutes,
  fromseconds,
}) => {
  const [combined, setCombined] = useState([]);
  useEffect(() => {
    let fromTime = fromhours + ":" + fromminutes + ":" + fromseconds;
    let toTime = tohours + ":" + tominutes + ":" + toseconds;

    let data = fileContent.data.Time;

    let result = [];

    data.map((item) => {
      let time = item.split("T")[1].split("+")[0];

      if (time >= fromTime && time <= toTime) {
        result.push(time);
      }
    });

    const combinedResult = result.map((item) => {
      let index = fileContent.data["Time"].findIndex((time) =>
        time.includes(item)
      );
      return {
        Date: moment(fileContent.data["Time"][index]).format("YYYY-MM-DD"),
        Close: fileContent.data["c"][index],
        Open: fileContent.data["o"][index],
        High: fileContent.data["h"][index],
        Low: fileContent.data["l"][index],
      };
    });

    setCombined(combinedResult);
    //     setCombined([
    //    {Date: "2017-11-17", Open: 171.039993, High: 171.389999, Low: 169.639999, Close: 170.149994 },
    //  {Date:" 2017-11-20", Open: 170.289993, High: 170.559998, Low: 169.559998, Close: 169.979996},
    //   {Date: "2017-11-21", Open: 170.779999, High: 173.699997, Low: 170.779999, Close: 173.139999},
    //   {Date: "2017-11-22", Open: 173.360001, High: 175, Low: 173.050003, Close: 174.960007},
    //     {Date:" 2017-11-24", Open: 175.100006, High: 175.5, Low: 174.649994, Close: 174.970001},
    //     {Date:" 2017-11-27", Open: 175.050003, High: 175.080002, Low: 173.339996, Close: 174.089996 },
    //     {Date: "2017-11-28", Open: 174.300003, High: 174.869995, Low: 171.860001, Close: 173.070007},
    // {Date:" 2017-11-29", Open: 172.630005, High: 172.919998, Low: 167.160004, Close: 169.479996},
    //      {Date:" 2017-11-30", Open: 170.429993, High: 172.139999, Low: 168.440002, Close: 171.850006},
    //      {Date:" 2017-12-01", Open: 169.949997, High: 171.669998, Low: 168.5, Close: 171.050003},
    //       {Date:" 2017-12-04", Open: 172.479996, High: 172.619995, Low: 169.630005, Close: 169.800003},
    //     {Date: "2017-12-05", Open: 169.059998, High: 171.520004, Low: 168.399994, Close: 169.639999},
    //        {Date: "2017-12-06", Open: 167.5, High: 170.199997, Low: 166.460007, Close: 169.009995},
    //       {Date: "2017-12-07", Open: 169.029999, High: 170.440002, Low: 168.910004, Close: 169.320007},
    //        {Date:" 2017-12-08", Open: 170.490005, High: 171, Low: 168.820007, Close: 169.369995},
    //       {Date: "2017-12-11", Open: 169.199997, High: 172.889999, Low: 168.789993, Close: 172.669998},
    //       {Date: "2017-12-12", Open: 172.149994, High: 172.389999, Low: 171.460007, Close: 171.699997},
    //        {Date:" 2017-12-13", Open: 172.5, High: 173.539993, Low: 172, Close: 172.270004},
    //       {Date: "2017-12-14", Open: 172.399994, High: 173.130005, Low: 171.649994, Close: 172.220001},
    //     {Date: "2017-12-15", Open: 173.630005, High: 174.169998, Low: 172.460007, Close: 173.970001},])
  }, [
    fileContent,
    fromhours,
    fromminutes,
    fromseconds,
    tohours,
    tominutes,
    toseconds,
  ]);

  return (
    <>
      <div className="data-formation">
        {combined.length > 0 ? (
          <GraphProvider data={combined} />
        ) : (
          <div>Blank</div>
        )}
      </div>
    </>
  );
};

export default DataFormation;
