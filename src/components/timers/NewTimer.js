
import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants";
import TimerBtn from "../generic/TimerBtn";
import { IncrementBtn, DecrementBtn } from "../helpers/HMSBtn";
import SetterButtons from "../helpers/SetterButtons";
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
import { TimerDescription } from './TimerStyles';
import WorkoutInventory from '../documentation/WorkoutInventory';


export const buildSetters = (type, setterBtnData, setterIntervalBtnData, countRounds, setCountRounds) => {
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

  return setters;
}

const NewTimer = () => {
  const navigate = useNavigate();
  const { createTimer, searchParams, timers } = useContext(TimerContext);
  
  const woSize = useRef(0);
  woSize.current = timers.length+1;

  const [type, setType] = useState("");
  const [countHrs, setCountHrs] = useState(0);
  const [countMins, setCountMins] = useState(0);
  const [countSecs, setCountSecs] = useState(0);
  const [intervalHrs, setIntervalHrs] = useState(0);
  const [intervalMins, setIntervalMins] = useState(0);
  const [intervalSecs, setIntervalSecs] = useState(0);
  const [countRounds, setCountRounds] = useState(1);
  const [description, setDescription] = useState("");
  const [timerPosition, setTimerPosition] = useState(woSize.current);

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
        countRounds,
        description
      },
      timerData
    );

    createTimer(timerData, timerPosition);

    // reset values
    setType("");
    setCountHrs(0);
    setCountMins(0);
    setCountSecs(0);
    setIntervalHrs(0);
    setIntervalMins(0);
    setIntervalSecs(0);
    setCountRounds(1);
    setDescription("");

    woSize.current = woSize.current+1;
    setTimerPosition(woSize.current);
  };

  const setters = buildSetters(
    type,
    setterBtnData, 
    setterIntervalBtnData,
    countRounds,
    setCountRounds, 
  );

  return (
    <>
    <WorkoutInventory />
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
      {type && <div className="setter-wrapper">{setters}</div>}
      {type && (<label>
          <span className="type-label">Workout position:</span>
          <select
            value={timerPosition}
            onChange={(e) => {
              setTimerPosition(e.target.value);
            }}
          >
            {timers.map((timer, i) => {
              return <option key={`t-create-${i}`} value={i}>{i+1}</option>
            })}
            <option value={woSize.current}>{woSize.current}</option>
          </select>
        </label>)
      }
      {type && (
        <div className="description-wrapper">
          Description (optional)
          <TimerDescription 
            value={description} 
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      )}
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
    </>
  );
};

export default NewTimer;
