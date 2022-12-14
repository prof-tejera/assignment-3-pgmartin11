import React, { useState, createContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { timers } from "../../views/WorkoutView";
import { usePersistedStateModified } from '../../hooks';
import { formattedDateTime, positionTimer } from '../../utils/helpers';
export const TimerContext = createContext({});


const TimerProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const workoutConfig = searchParams.get('myWorkout') === null ? [] : JSON.parse(decodeURIComponent(searchParams.get('myWorkout')));

  const [count, setCount] = usePersistedStateModified('count', null);
  const [round, setRound] = usePersistedStateModified('round', null);
  const [interval, setInterv] = usePersistedStateModified('interval', null);
  const [remainingTime, setRemainingTime] = usePersistedStateModified('remainingTime', 0);
  const [activeTimerIdx, setActiveTimerIdx] = usePersistedStateModified('activeTimerIdx', null);
  const [timers, setTimers] = useState(workoutConfig);
  const [history, setHistory] = usePersistedStateModified('history', []);
  const [isPaused, setPaused] = usePersistedStateModified('isPaused', false);
  const [isStopped, setStopped] = usePersistedStateModified('isStopped', true);
  const [workoutRunningTime, setWorkoutRunningTime] = usePersistedStateModified('workoutRunningTime', 0);

  const markTimerComplete = () => {
    const newTs = timers.map((timer, i) => {
      if (i == activeTimerIdx) {
        return { ...timer, isCompleted: true };
      }
      return timer;
    });
    setTimers(newTs);
    setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(newTs)) });
  };

  const dispatcher = () => {
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

      // use newTs rather than timers to avoid a race condition
      setHistory([...history, { date_time: formattedDateTime(), timers: newTs }]);
      setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(newTs)) });
    }
  };

  const createTimer = (timerData, pos) => {
    const buf = positionTimer(timerData, pos, timers);
    setTimers(buf);
    setSearchParams({ myWorkout: encodeURIComponent(JSON.stringify(buf)) });
  }

  const retrieveTimer = id => timers.find(timer => timer.id == id);

  const updateTimer = (timerData, pos) => {
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
        workoutRunningTime, 
        setWorkoutRunningTime,
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
