import React from "react";

import "./TimePicker.css";

const TimePicker = ({
  label,
  hours,
  minutes,
  seconds,
  setHours,
  setMinutes,
  setSeconds,
}) => {
  return (
    <>
      <div>
        <label>{label}</label>
        <input
          className="time-select-class"
          type="number"
          min="0"
          max="23"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        &nbsp;
        <input
          className="time-select-class"
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
        &nbsp;
        <input
          className="time-select-class"
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
        />
      </div>
    </>
  );
};

export default TimePicker;