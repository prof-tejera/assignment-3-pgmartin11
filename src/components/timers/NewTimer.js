
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants";
import TimerBtn from "../../components/generic/TimerBtn";
import { IncrementBtn, DecrementBtn } from "../../components/helpers/HMSBtn";
import SetterButtons from "../../components/helpers/SetterButtons";
import {
  incrementHelper,
  decrementHelper,
  calcSeconds,
  makeId,
  buildSetterBtnData,
  buildSetterIntervalBtnData,
  getInitialTimerData,
  setTimerDataByType
} from "../../utils/helpers";
import "./NewTimer.css";
import { TimerContext } from "./TimerProvider";

const NewTimer = () => {
  const navigate = useNavigate();
  const { createTimer, searchParams } = useContext(TimerContext);

  const [type, setType] = useState("");
  const [countHrs, setCountHrs] = useState(0);
  const [countMins, setCountMins] = useState(0);
  const [countSecs, setCountSecs] = useState(0);
  const [intervalHrs, setIntervalHrs] = useState(0);
  const [intervalMins, setIntervalMins] = useState(0);
  const [intervalSecs, setIntervalSecs] = useState(0);
  const [countRounds, setCountRounds] = useState(1);

  const setterBtnData = buildSetterBtnData({
    countHrs,
    countMins,
    countSecs,
    setCountHrs,
    setCountMins,
    setCountSecs,
  });

  const setterIntervalBtnData = buildSetterIntervalBtnData({
    intervalHrs,
    intervalMins,
    intervalSecs,
    setIntervalHrs,
    setIntervalMins,
    setIntervalSecs,
    countRounds
  });

  const addTimer = () => {
    let timerData = getInitialTimerData();

    timerData.id = makeId();
    timerData.title = type;
    timerData = setTimerDataByType(
      type, 
      {
        countHrs,
        countMins,
        countSecs,
        intervalHrs,
        intervalMins,
        intervalSecs,
      },
      timerData
    );

    createTimer(timerData);

    // reset values
    setType("");
    setCountHrs(0);
    setCountMins(0);
    setCountSecs(0);
    setIntervalHrs(0);
    setIntervalMins(0);
    setIntervalSecs(0);
    setCountRounds(1);
  };

  let setters;
  switch (type) {
    case "Stopwatch":
    case "Countdown":
      setters = <SetterButtons {...setterBtnData} />;
      break;
    case "XY":
      setters = (
        <>
          <div className="interval-wrapper">
            <SetterButtons {...setterBtnData} />
          </div>
          <span className="time-setter-title"> Rounds:</span>
          <DecrementBtn
            handler={() => {
              setCountRounds(decrementHelper(countRounds, 1));
            }}
          />
          <span className="time-setter-val">{countRounds}</span>
          <IncrementBtn
            handler={() => {
              setCountRounds(incrementHelper(countRounds));
            }}
          />
        </>
      );
      break;
    case "Tabata":
      setters = (
        <>
          <div className="interval-wrapper">
            <SetterButtons {...setterBtnData} />
          </div>
          <div className="interval-wrapper">
            <SetterButtons {...setterIntervalBtnData} />
          </div>
          <span className="time-setter-title">Rounds:</span>
          <DecrementBtn
            handler={() => {
              setCountRounds(decrementHelper(countRounds, 1));
            }}
          />
          <span className="time-setter-val">{countRounds}</span>
          <IncrementBtn
            handler={() => {
              setCountRounds(incrementHelper(countRounds));
            }}
          />
        </>
      );
  }

  return (
    <div className="config-panel">
      <h1>Add a Timer</h1>
      <label>
        <span className="type-label">Choose type:</span>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value="">--</option>
          <option value="Countdown">Countdown</option>
          <option value="Stopwatch">Stopwatch</option>
          <option value="XY">XY</option>
          <option value="Tabata">Tabata</option>
        </select>
      </label>
      <br />
      {type && <div className="setter-wrapper">{setters}</div>}
      <br />
      {type && (
        <button className="add-timer-submit" onClick={addTimer}>
          Add Timer
        </button>
      )}
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.HISTORY, search: `?${searchParams}` }) } label="History" />
    </div>
  );
};

export default NewTimer;
