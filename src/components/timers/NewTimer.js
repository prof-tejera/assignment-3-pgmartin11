import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants";
import TimerBtn from "../../components/generic/TimerBtn";
import { IncrementBtn, DecrementBtn } from "../../components/helpers/HMSBtn";
import SetterButtons from "../../components/helpers/SetterButtons";
import {
  incrementHelper,
  decrementHelper,
  calcSeconds,
} from "../../utils/helpers";
import { TimerContext } from "./TimerProvider";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import XY from "./XY";
import Tabata from "./Tabata";
import "./NewTimer.css";

const NewTimer = () => {
  const navigate = useNavigate();
  const { timers, setTimers } = useContext(TimerContext);

  const [type, setType] = useState("");
  const [countHrs, setCountHrs] = useState(0);
  const [countMins, setCountMins] = useState(0);
  const [countSecs, setCountSecs] = useState(0);
  const [intervalHrs, setIntervalHrs] = useState(0);
  const [intervalMins, setIntervalMins] = useState(0);
  const [intervalSecs, setIntervalSecs] = useState(0);
  const [countRounds, setCountRounds] = useState(1);

  const setterBtnData = {
    hoursLabel: "Hours",
    minutesLabel: "Minutes",
    secondsLabel: "Seconds",
    countHrs,
    countMins,
    countSecs,
    setCountHrs,
    setCountMins,
    setCountSecs,
  };

  const setterIntervalBtnData = {
    hoursLabel: "Interval Hours",
    minutesLabel: "Interval Minutes",
    secondsLabel: "Interval Seconds",
    countHrs: intervalHrs,
    countMins: intervalMins,
    countSecs: intervalSecs,
    setCountHrs: setIntervalHrs,
    setCountMins: setIntervalMins,
    setCountSecs: setIntervalSecs,
  };

  const addTimer = () => {
    let timerData = {
      title: "",
      component: "",
      startVal: "",
      endVal: "",
      roundStartVal: "",
      roundEndVal: "",
      intervalStartVal: "",
      intervalEndVal: "",
      isRunning: false,
      isCompleted: false,
    };
    timerData.title = type;

    switch (type) {
      case "Stopwatch":
        timerData.component = Stopwatch;
        timerData.startVal = 0;
        timerData.endVal = calcSeconds(countHrs, countMins, countSecs);
        timerData.timerSecs = timerData.endVal;
        break;
      case "Countdown":
        timerData.component = Countdown;
        timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
        timerData.endVal = 0;
        timerData.timerSecs = timerData.startVal;
        break;
      case "XY":
        timerData.component = XY;
        timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
        timerData.endVal = 0;
        timerData.roundStartVal = countRounds;
        timerData.roundEndVal = 1;
        timerData.timerSecs = timerData.startVal * timerData.roundStartVal;
        break;
      case "Tabata":
        timerData.component = Tabata;
        timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
        timerData.endVal = 0;
        timerData.intervalStartVal = calcSeconds(
          intervalHrs,
          intervalMins,
          intervalSecs
        );
        timerData.intervalEndVal = 0;
        timerData.roundStartVal = countRounds;
        timerData.roundEndVal = 1;
        timerData.timerSecs =
          (timerData.startVal + timerData.intervalStartVal) *
          timerData.roundStartVal;
    }

    const buf = [...timers, timerData];
    setTimers(buf);

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
      <TimerBtn handler={() => navigate(PATHS.HOME)} label="Back to workout" />
      <TimerBtn handler={() => navigate(PATHS.DOCS)} label="Documentation" />
    </div>
  );
};

export default NewTimer;
