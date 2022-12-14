import { useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import DisplayTime from "../../components/generic/DisplayTime";
import { TimerContext } from "./TimerProvider";

const InnerStopwatch = ({ endVal }) => {
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
      if (count < endVal) {
        t = setTimeout(() => {
          setCount(count + 1);
          setRemainingTime(remainingTime - 1);
        }, 1000);
      }

      if (count == endVal) {
        posRef.current.scrollIntoView({ behavior: "smooth" });
        dispatcher();
      }
    }

    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [count, endVal, isPaused, isStopped]);

  return (
    <div className="main-panel" ref={posRef}>
      <DisplayTime label="Count" count={count} />
    </div>
  );
};

InnerStopwatch.propTypes = {
  endVal: PropTypes.number.isRequired,
};

const Stopwatch = ({
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

  return <InnerStopwatch endVal={endVal} />;
};

Stopwatch.propTypes = {
  startVal: PropTypes.number.isRequired,
  endVal: PropTypes.number.isRequired,
  isRunning: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

export default Stopwatch;
