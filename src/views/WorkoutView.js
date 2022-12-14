import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { PATHS, TIMERS } from "../constants";
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

const TimerDescription = styled.textarea`
  border: none;
  font-size: 16px;
  resize: vertical;
  width: 100%;
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
    workoutRunningTime, 
    setWorkoutRunningTime,
    activeTimerIdx,
    setActiveTimerIdx,
    timers,
    setTimers,
    removeTimer,
    remainingTime,
    setRemainingTime,
    searchParams,
    setSearchParams,
  } = useContext(TimerContext);

  useEffect(() => {
    if (isStopped) {
      const woTime = calcWorkoutTime(timers);
      setWorkoutRunningTime(woTime);
      setRemainingTime(woTime);
    }
  }, [timers, isStopped]);

  const setTimerComponent = (timerData, idx) => {
    let timerComponent;

    switch(timerData.title) {
      case TIMERS.STOPWATCH:
        timerComponent = <Stopwatch {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case TIMERS.COUNTDOWN:
        timerComponent = <Countdown {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case TIMERS.XY: 
        timerComponent = <XY {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      case TIMERS.TABATA:
        timerComponent = <Tabata {...timerData} isRunning={idx === activeTimerIdx} />;
        break;
      default:
    }

    return timerComponent;
  }

  const isWorkoutDone = isWorkoutCompleted(timers);
  const pauseLabel = isPaused ? "Resume" : "Pause";

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

                  setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(timers)) });
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
                setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(newTs)) });
              }}
            />
            <TimerBtn
              disabled={isStopped}
              label="Fast Forward"
              handler={() => {
                if (!isStopped) {
                  setCount(timers[activeTimerIdx].endVal);

                  if (
                    timers[activeTimerIdx].title == TIMERS.XY ||
                    timers[activeTimerIdx].title == TIMERS.TABATA
                  ) {
                    setRound(timers[activeTimerIdx].roundEndVal);
                  }
                  if (timers[activeTimerIdx].title == TIMERS.TABATA) {
                    setInterv(timers[activeTimerIdx].intervalEndVal);
                  }

                  setRemainingTime(
                    workoutRunningTime -
                      calcTotalFastForwardTime(timers, activeTimerIdx)
                  );
                }
              }}
            />
          </div>
        </div>
      )}
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` })} label="Documentation" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.HISTORY, search: `?${searchParams}` }) } label="History" />
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
                handler={() => removeTimer(timerData.id)}
                label="X"
              />
            )}          
            <Timer key={`timer-${timerData.title}-${idx}`}>
              {isStopped && (
                <TimerBtn
                  key={`edit-btn-${timerData.title}-${idx}`}
                  handler={() => navigate({ pathname: PATHS.EDIT(timerData.id, idx), search: `?${searchParams}` })}
                  label="Edit"
                />
              )}  
              <TimerTitle>{timerData.title}</TimerTitle>
              <p className="timer-desc">{timerData.description}</p>
              {setTimerComponent(timerData, idx)}
            </Timer>
          </div>
        ))}
      </Timers>
    </>
  );
};

export default WorkoutView;
