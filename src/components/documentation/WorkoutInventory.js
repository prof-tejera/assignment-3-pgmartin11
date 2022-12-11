import React, { useContext } from "react";
import { TimerContext } from "../timers/TimerProvider";
import { calcWorkoutTime, calcHMS } from "../../utils/helpers";
import { TIMERS } from "../../constants";
import styled from "styled-components";
import "./WorkoutInventory.css";


const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  display: flex;
  justify-content: left;
  padding-top: 20px;
  padding-left: 20px;
  font-size: 1.3rem;
`;

const WorkoutInventory = () => {    
  const { timers } = useContext(TimerContext);     

  if (timers.length == 0) {
    return (
      <div className="wo-config-panel">
        <Title>No Timers Configured</Title>
      </div>
    );
  }                                                                                                                                                                                                                                                            
  return (
    <div className="wo-config-panel">
      <Title>Configured Timers</Title>
      <Container>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Type</th>
              <th>Counter Time</th>
              <th>Total Intervals</th>
              <th>Total Rounds</th>
            </tr>
          </thead>
          <tbody>
            {timers.map((timer, i) => {
              let count = 0;
              if (timer.title == TIMERS.STOPWATCH) { 
                count = timer.endVal;
              } else {
                count = timer.startVal;
              }

              const { timerHrs, timerMins, timerSecs } = calcHMS(count);
              const numRounds = timer.roundStartVal != '' ? timer.roundStartVal : 'N/A';
              const numIntervals = timer.intervalStartVal != '' ? timer.intervalStartVal : 'N/A';

              return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{timer.title}</td>
                  <td>{timerHrs}:{timerMins}:{timerSecs}</td>
                  <td>{numIntervals}</td>
                  <td>{numRounds}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </div>
  );
};

export default WorkoutInventory;
