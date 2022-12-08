import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../constants";
import TimerBtn from "../generic/TimerBtn";
import { IncrementBtn, DecrementBtn } from "../helpers/HMSBtn";
import SetterButtons from "../helpers/SetterButtons";
import { buildSetters } from "./NewTimer";
import {
  incrementHelper,
  decrementHelper,
  calcSeconds,
  calcHMS,
  buildSetterBtnData,
  buildSetterIntervalBtnData,
  getInitialTimerData,
  setTimerDataByType
} from "../../utils/helpers";
import "./NewTimer.css";
import { TimerContext } from "./TimerProvider";
import { TimerDescription } from './TimerStyles';
import WorkoutInventory from '../documentation/WorkoutInventory';


const InnerEditTimer = ({ timer, pos }) => {
  const navigate = useNavigate();
  const { updateTimer, searchParams, timers } = useContext(TimerContext);

  const type = timer.title;

  let tmrSecs = 0;
  switch (type) {
    case 'Stopwatch':
      tmrSecs = timer.endVal;
      break;
    case 'Countdown':
    case 'XY':
    case 'Tabata':
      tmrSecs = timer.startVal;
    break;
    default:
  }
  const { timerHrs, timerMins, timerSecs } = calcHMS(tmrSecs, true);

  const [countHrs, setCountHrs] = useState(timerHrs);
  const [countMins, setCountMins] = useState(timerMins);
  const [countSecs, setCountSecs] = useState(timerSecs);
  const [description, setDescription] = useState(timer.description);

  let timerIntervalHrs = 0,
      timerIntervalMins = 0,
      timerIntervalSecs = 0;
  if (timer.title == 'Tabata') {
    const { timerHrs, timerMins, timerSecs } = calcHMS(timer.intervalStartVal, true);
    timerIntervalHrs = timerHrs;
    timerIntervalMins = timerMins;
    timerIntervalSecs = timerSecs;
  }

  const [intervalHrs, setIntervalHrs] = useState(timerIntervalHrs);
  const [intervalMins, setIntervalMins] = useState(timerIntervalMins);
  const [intervalSecs, setIntervalSecs] = useState(timerIntervalSecs);
  const [countRounds, setCountRounds] = useState(timer.roundStartVal);
  const [timerPosition, setTimerPosition] = useState(pos);

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
  });

  const modifyTimer = () => {
    let timerData = getInitialTimerData();

    timerData.id = timer.id;
    timerData.title = timer.title;
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

    updateTimer(timerData, timerPosition);
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
      <h1>Edit Timer</h1>
      <h2>{timer.title} Timer</h2>
      <div className="setter-wrapper">{setters}</div>
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
      <button className="add-timer-submit" onClick={modifyTimer}>
        Update Timer
      </button>
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.HISTORY, search: `?${searchParams}` }) } label="History" />
    </div>
    </>
  );
};

const EditTimer = () => {
  const { id, pos } = useParams();

  const { retrieveTimer } = useContext(TimerContext);

  const timer = retrieveTimer(id);

  if (!timer) return <div>Timer Not Found</div>;

  return <InnerEditTimer timer={timer} pos={pos==':pos' ? 0 : pos}/>;

}

export default EditTimer;
