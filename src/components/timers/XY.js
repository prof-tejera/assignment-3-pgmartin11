import { useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import DisplayTime from "../../components/generic/DisplayTime";
import DisplayRound from "../../components/generic/DisplayRound";
import { TimerContext } from "./TimerProvider";

const InnerXY = ({ startVal }) => {
  const {
    count,
    setCount,
    round,
    setRound,
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

      if (round - 1 > 0 && count == 0) {
        setRound(round - 1);
        setCount(startVal);
      }

      if (round == 1 && count == 0) {
        posRef.current.scrollIntoView({ behavior: "smooth" });
        dispatcher();
      }
    }

    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [round, count, isPaused, isStopped]);

  const pauseLabel = isPaused ? "Resume" : "Pause";

  const titleClass = !isStopped
    ? "time-setter-title disabled"
    : "time-setter-title";
  const valClass = !isStopped ? "time-setter-val disabled" : "time-setter-val";

  return (
    <div className="main-panel" ref={posRef}>
      <DisplayTime label="Count" count={count} />
      <DisplayRound round={round} />
    </div>
  );
};

InnerXY.propTypes = {
  startVal: PropTypes.number.isRequired,
};

const XY = ({
  startVal,
  endVal,
  roundStartVal,
  roundEndVal,
  isRunning = false,
  isCompleted = false,
}) => {
  if (!isRunning || isCompleted) {
    return (
      <div className="main-panel">
        <DisplayTime label="Count" count={isCompleted ? endVal : startVal} />
        <DisplayRound round={isCompleted ? roundEndVal : roundStartVal} />
      </div>
    );
  }

  return (
    <InnerXY
      startVal={startVal}
    />
  );
};

XY.propTypes = {
  startVal: PropTypes.number.isRequired,
  endVal: PropTypes.number.isRequired,
  roundStartVal: PropTypes.number.isRequired,
  roundEndVal: PropTypes.number.isRequired,
  isRunning: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

export default XY;
