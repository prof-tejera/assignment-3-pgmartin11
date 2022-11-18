import { useEffect, useContext, useRef } from "react";
import { IncrementBtn, DecrementBtn } from "../../components/helpers/HMSBtn";
import DisplayTime from "../../components/generic/DisplayTime";
import { TimerContext } from "./TimerProvider";

const InnerCountdown = ({ startVal, endVal }) => {
  const {
    count,
    setCount,
    isPaused,
    isStopped,
    remainingTime,
    setRemainingTime,
    dispatcher,
  } = useContext(TimerContext);
  const posRef = useRef();

  useEffect(() => {
    let t;

    if (!isPaused && !isStopped) {
      if (count > 0) {
        t = setTimeout(() => {
          setCount(count - 1);
          setRemainingTime(remainingTime - 1);
        }, 1000);
      }

      if (count == 0) {
        dispatcher(posRef);
      }
    }

    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [count, isPaused, isStopped]);

  const pauseLabel = isPaused ? "Resume" : "Pause";

  return (
    <div className="main-panel" ref={posRef}>
      <DisplayTime label="Count" count={count} />
    </div>
  );
};

const Countdown = ({
  startVal,
  endVal,
  isRunning = false,
  isCompleted = false,
}) => {
  if (!isRunning || isCompleted) {
    return (
      <div className="main-panel">
        <DisplayTime label="Count" count={isCompleted ? endVal : startVal} />
      </div>
    );
  }

  return <InnerCountdown startVal={startVal} endVal={endVal} />;
};

export default Countdown;
