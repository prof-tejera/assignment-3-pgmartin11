import React, { useState, createContext } from "react";
import { timers } from "../../views/WorkoutView";

export const TimerContext = createContext({});

const TimerProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [interval, setInterv] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [activeTimerIdx, setActiveTimerIdx] = useState(0);
  const [timers, setTimers] = useState([]);
  const [isPaused, setPaused] = useState(false);
  const [isStopped, setStopped] = useState(true);

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
