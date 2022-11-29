import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../constants";
import TimerBtn from "../../components/generic/TimerBtn";
import { IncrementBtn, DecrementBtn } from "../../components/helpers/HMSBtn";
import SetterButtons from "../../components/helpers/SetterButtons";
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

const InnerEditTimer = ({ timer }) => {
  const navigate = useNavigate();
  const { updateTimer, searchParams } = useContext(TimerContext);

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
        countRounds
      },
      timerData
    );

    updateTimer(timerData);
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
      <h1>Edit Timer</h1>
      <h2>{timer.title} Timer</h2>
      <div className="setter-wrapper">{setters}</div>
      <br />
      <button className="add-timer-submit" onClick={modifyTimer}>
        Update Timer
      </button>
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.HISTORY, search: `?${searchParams}` }) } label="History" />
    </div>
  );
};

const EditTimer = () => {
  const { id } = useParams();
  const { retrieveTimer } = useContext(TimerContext);
  const timer = retrieveTimer(id);

  if (!timer) return <div>Timer Not Found</div>;

  return <InnerEditTimer timer={timer} />;

}

export default EditTimer;
