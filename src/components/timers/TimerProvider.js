import React, { useState, createContext } from "react";
import { timers } from "../../views/WorkoutView";

/* keep these for now - remove when initial_timers structure removed */
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import XY from "./XY";
import Tabata from "./Tabata";
/************************/

import { usePersistedStatePolling } from '../../hooks';

export const TimerContext = createContext({});

const TimerProvider = ({ children }) => {
  // workout - hard-coded for now
  const initial_timers = [
    { title: "Stopwatch", component: Stopwatch, startVal: 0, endVal: 5, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 5, isRunning: false, isCompleted: false },
    { title: "Countdown", component: Countdown, startVal: 8, endVal: 0, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 8, isRunning: false, isCompleted: false },     
    { title: "XY", component: XY, startVal: 10, endVal: 0, roundStartVal: 3, roundEndVal: 1, intervalStartVal: null, intervalEndVal: null, timerSecs: 30, isRunning: false, isCompleted: false },
    { title: "Tabata", component: Tabata, startVal: 10, endVal: 0, roundStartVal: 3, roundEndVal: 1, intervalStartVal: 5, intervalEndVal: 0, timerSecs: 45, isRunning: false, isCompleted: false },
  ];

  const [count, setCount] = usePersistedStatePolling('count', 0);
  const [round, setRound] = usePersistedStatePolling('round', 0);
  const [interval, setInterv] = usePersistedStatePolling('interval', 0);
  const [remainingTime, setRemainingTime] = usePersistedStatePolling('remainingTime', 0);
  const [activeTimerIdx, setActiveTimerIdx] = usePersistedStatePolling('activeTimerIdx', 0);
  const [timers, setTimers] = useState(initial_timers);
  //const [timers, setTimers] = usePersistedStatePolling('timer', initial_timers);
  //const [timers, setTimers] = useState([]);
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
        dispatcher,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
