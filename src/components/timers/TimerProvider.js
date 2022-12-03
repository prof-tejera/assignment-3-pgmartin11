import React, { useState, createContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { timers } from "../../views/WorkoutView";
import { usePersistedStatePolling } from '../../hooks';
import { formattedDateTime, positionTimer } from '../../utils/helpers';
export const TimerContext = createContext({});


const TimerProvider = ({ children }) => {
  // workout - hard-coded for now
  const initial_timers = [
    { id: 12, title: "Countdown", description: "this is a CountDown timer", startVal: 8, endVal: 0, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 8, isRunning: false, isCompleted: false },     
    { id: 13, title: "Stopwatch", description: "this is a Stopwatch timer",  startVal: 0, endVal: 9, roundStartVal: null, roundEndVal: null, intervalStartVal: null, intervalEndVal: null, timerSecs: 9, isRunning: false, isCompleted: false },
    { id: 14, title: "XY", description: "this is a XY timer",  startVal: 5, endVal: 0, roundStartVal: 2, roundEndVal: 1, intervalStartVal: null, intervalEndVal: null, timerSecs: 10, isRunning: false, isCompleted: false },
    { id: 15, title: "Tabata", description: "this is a Tabata timer",  startVal: 10, endVal: 0, roundStartVal: 3, roundEndVal: 1, intervalStartVal: 5, intervalEndVal: 0, timerSecs: 45, isRunning: false, isCompleted: false },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const workoutConfig = searchParams.get('myWorkout') === null ? initial_timers : JSON.parse(decodeURIComponent(searchParams.get('myWorkout')));

  const [count, setCount] = usePersistedStatePolling('count', null);
  const [round, setRound] = usePersistedStatePolling('round', null);
  const [interval, setInterv] = usePersistedStatePolling('interval', null);
  const [remainingTime, setRemainingTime] = usePersistedStatePolling('remainingTime', 0);
  const [activeTimerIdx, setActiveTimerIdx] = usePersistedStatePolling('activeTimerIdx', 0);
  const [timers, setTimers] = useState(workoutConfig); // usePersistedStatePolling ??
  const [history, setHistory] = usePersistedStatePolling('history', []);
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
      setActiveTimerIdx(null);
      setCount(null);
      setRound(null);
      setInterval(null);
      setHistory([...history, { date_time: formattedDateTime(), timers }]);
      setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(timers)) });
    }
  };

  const createTimer = (timerData, pos) => {
    //const buf = [...timers, timerData];
    //setTimers(buf);
    const buf = positionTimer(timerData, pos, timers);
    setTimers(buf);
    setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(buf)) });
  }

  const retrieveTimer = id => timers.find(timer => timer.id == id);

  const updateTimer = (timerData, pos) => {
    //const buf = timers.map(timer => timer.id == timerData.id ? timerData : timer );
    const buf = timers.filter(timer => timer.id != timerData.id);
    setTimers(positionTimer(timerData, pos, buf));
    setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(buf)) });
  }

  const removeTimer = id => {
    const buf = timers.filter(timer => timer.id != id);
    setTimers(buf);
    setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(buf)) });
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
        createTimer,
        retrieveTimer,
        updateTimer,
        removeTimer,
        remainingTime,
        setRemainingTime,
        searchParams,
        setSearchParams,
        history, 
        setHistory,
        dispatcher,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
