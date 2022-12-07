import React, { useContext } from "react";
import { TimerContext } from "../timers/TimerProvider";
import { calcWorkoutTime, calcHMS } from "../../utils/helpers";
import styled from "styled-components";


{/*
const Wrapper = styled.div`
  border: 1px solid #121212;
  margin: 20px 0px;
`;
 */}

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
  return (
    <div>
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
              if (timer.title == 'Stopwatch') { 
                count = timer.endVal;
              } else {
                count = timer.startVal;
              }

              const { timerHrs, timerMins, timerSecs } = calcHMS(count);
              const numRounds = timer.roundEndVal != '' ? timer.roundEndVal : 'N/A';
              const numIntervals = timer.intervalEndVal != '' ? timer.intervalEndVal : 'N/A';

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
