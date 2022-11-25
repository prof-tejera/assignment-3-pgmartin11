import React, { useState, createContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { timers } from "../../views/WorkoutView";
import { usePersistedStatePolling } from '../../hooks';

export const TimerContext = createContext({});

const TimerProvider = ({ children }) => {
  // workout - hard-coded for now
  const initial_timers = [
    { title: "Countdown", startVal: 8, endVal: 0, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 8, isRunning: false, isCompleted: false },     
    { title: "Stopwatch", startVal: 0, endVal: 9, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 9, isRunning: false, isCompleted: false },
    { title: "XY", startVal: 5, endVal: 0, roundStartVal: 2, roundEndVal: 1, intervalStartVal: null, intervalEndVal: null, timerSecs: 10, isRunning: false, isCompleted: false },
    { title: "Tabata", startVal: 10, endVal: 0, roundStartVal: 3, roundEndVal: 1, intervalStartVal: 5, intervalEndVal: 0, timerSecs: 45, isRunning: false, isCompleted: false },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  let workoutConfig = searchParams.get('myWorkout') === null ? initial_timers : JSON.parse(decodeURIComponent(searchParams.get('myWorkout')));
//  let workoutConfig = searchParams.get('myWorkout') === null ? []: JSON.parse(decodeURIComponent(searchParams.get('myWorkout')));

  const [count, setCount] = usePersistedStatePolling('count', null);
  const [round, setRound] = usePersistedStatePolling('round', null);
  const [interval, setInterv] = usePersistedStatePolling('interval', null);
  const [remainingTime, setRemainingTime] = usePersistedStatePolling('remainingTime', 0);
  const [activeTimerIdx, setActiveTimerIdx] = usePersistedStatePolling('activeTimerIdx', 0);
  const [timers, setTimers] = useState(workoutConfig);
  const [isPaused, setPaused] = usePersistedStatePolling('isPaused', false);
  const [isStopped, setStopped] = usePersistedStatePolling('isStopped', true);

  const markTimerComplete = () => {
    const newTs = timers.map((timer, i) => {
      if (i == activeTimerIdx) {
        return { ...timer, isCompleted: true };
      }
      return timer;
    });
    setTimers(newTs);
  };

  const dispatcher = (posRef) => {
    if (activeTimerIdx + 1 < timers.length) {
      markTimerComplete();
      setCount(timers[activeTimerIdx + 1].startVal);

      if (
        timers[activeTimerIdx + 1].title == "XY" ||
        timers[activeTimerIdx + 1].title == "Tabata"
      ) {
        setRound(timers[activeTimerIdx + 1].roundStartVal);
      }
      if (timers[activeTimerIdx + 1].title == "Tabata") {
        setInterv(timers[activeTimerIdx + 1].intervalStartVal);
      }

      setActiveTimerIdx(activeTimerIdx + 1);
      posRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      // mark all timers complete
      const newTs = timers.map((timer, i) => {
        return { ...timer, isRunning: false, isCompleted: false };
      });
      setTimers(newTs);
      setStopped(true);
      //XXX
      setActiveTimerIdx(null);
      setCount(null);
      setRound(null);
      setInterval(null);
      setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(timers)) });
    }
  };

  return (
    <TimerContext.Provider
      value={{
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
        dispatcher,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
