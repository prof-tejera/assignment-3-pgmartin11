import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../constants";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import TimerBtn from "../components/generic/TimerBtn";
import {
  calcWorkoutTime,
  calcTotalFastForwardTime,
  isWorkoutCompleted,
} from "../utils/helpers";
import { TimerContext } from "../components/timers/TimerProvider";
import DisplayTime from "../components/generic/DisplayTime";

const Timers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Timer = styled.div`
  border: 2px solid gray;
  border-radius: 5px;
  padding: 20px;
  margin: 10px;
  font-size: 1.5rem;
  background-color: #ced5e0;
`;

const TimerTitle = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
`;

const WorkoutView = () => {
  const navigate = useNavigate();

  const {
    count,
    setCount,
    round,
    setRound,
    interval,
    setInterv,
    isPaused,
    setPaused,
    isStopped,
    setStopped,
    activeTimerIdx,
    setActiveTimerIdx,
    timers,
    setTimers,
    remainingTime,
    setRemainingTime,
    searchParams,
    setSearchParams,
  } = useContext(TimerContext);

  const workoutRunningTime = useRef(0);

  useEffect(() => {
    if (isStopped) {
      workoutRunningTime.current = calcWorkoutTime(timers);
      setRemainingTime(workoutRunningTime.current);
    }
  }, [timers, isStopped]);

  const removeTimer = (idx) => {
    const buf = timers.filter((timer, i) => i !== idx);
    setTimers(buf);
    setSearchParams({ ...searchParams, myWorkout: encodeURIComponent(JSON.stringify(buf)) });
  };

  const setTimerComponent = (timerData, idx) => {
    let timerComponent;

    switch(timerData.title) {
      case 'Stopwatch':
        timerComponent = <Stopwatch {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case 'Countdown':
        timerComponent = <Countdown {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case 'XY': 
        timerComponent = <XY {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case 'Tabata':
        timerComponent = <Tabata {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      default:
    }

    return timerComponent;
  }

  const isWorkoutDone = isWorkoutCompleted(timers);

  const pauseLabel = isPaused ? "Resume" : "Pause";

console.log('activeTimerIdx', activeTimerIdx);

  return (
    <>
      {timers.length > 0 && (
        <div className="main-wrap">
          <div className="control-btn-wrapper">
            {isStopped && (
              <TimerBtn
                label="Start"
                handler={() => {
                  let idx = activeTimerIdx == null ? 0 : activeTimerIdx;

                  if (count == null) {
                    setCount(timers[idx].startVal);
                  }

                  if (timers[idx].title == "XY" || timers[idx].title == "Tabata") {
                    if (round == null) {
                      setRound(timers[idx].roundStartVal);
                    }
                  }
                  if (timers[idx].title == "Tabata") {
                    if (interval == null) {
                      setInterv(timers[idx].intervalStartVal);
                    }
                  }

                  setActiveTimerIdx(idx);
                  setStopped(false);
                  setPaused(false);
                }}
              />
            )}
            {!isStopped && (
              <TimerBtn
                label={pauseLabel}
                handler={() => setPaused(!isPaused)}
              />
            )}
            <TimerBtn
              disabled={isStopped}
              label="Reset"
              handler={() => {
                const newTs = timers.map((timer, i) => {
                  return { ...timer, isRunning: false, isCompleted: false };
                });
                setTimers(newTs);
                setStopped(true);
                setActiveTimerIdx(null);
                setCount(null);
                setRound(null);
                setInterval(null);
              }}
            />
            <TimerBtn
              disabled={isStopped}
              label="Fast Forward"
              handler={() => {
                if (!isStopped) {
                  setCount(timers[activeTimerIdx].endVal);

                  if (
                    timers[activeTimerIdx].title == "XY" ||
                    timers[activeTimerIdx].title == "Tabata"
                  ) {
                    setRound(timers[activeTimerIdx].roundEndVal);
                  }
                  if (timers[activeTimerIdx].title == "Tabata") {
                    setInterv(timers[activeTimerIdx].intervalEndVal);
                  }

                  setRemainingTime(
                    workoutRunningTime.current -
                      calcTotalFastForwardTime(timers, activeTimerIdx)
                  );
                }
              }}
            />
          </div>
        </div>
      )}
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` })} label="Documentation" />
      {timers.length > 0 && isStopped && (
        <TimerBtn handler={() => navigate({ pathname: PATHS.ADD, search: `?${searchParams}` })} label="Add Timer" />
      )}
      {timers.length > 0 && isStopped && !isWorkoutDone && (
        <span className="t-total">
          <DisplayTime label="Total time" count={calcWorkoutTime(timers)} />
        </span>
      )}
      {timers.length > 0 && (!isStopped || isWorkoutDone) && (
        <span className="t-remaining">
          <DisplayTime
            label="Time remaining"
            count={isWorkoutDone ? 0 : remainingTime}
          />
        </span>
      )}
      <Timers>
        {timers.length == 0 && (
          <>
            <h2>No workout configured</h2>
            <p className="add-timer-wrapper">
              Please <Link to={PATHS.ADD}>add one or more timers</Link> to get started
            </p>
          </>
        )}
        {timers.map((timerData, idx) => (
          <div
            className={
              "timer-wrapper " +
              (idx === activeTimerIdx && (!isStopped || isWorkoutDone)
                ? "isActive"
                : "")
            }
            key={`wrap-${timerData.title}-${idx}`}
          >
            {isStopped && (
              <TimerBtn
                key={`del-btn-${timerData.title}-${idx}`}
                handler={() => removeTimer(idx)}
                label="X"
              />
            )}
            <Timer key={`timer-${timerData.title}-${idx}`}>
              <TimerTitle>{timerData.title}</TimerTitle>
              {setTimerComponent(timerData, idx)}
            </Timer>
          </div>
        ))}
      </Timers>
    </>
  );
};

export default WorkoutView;
