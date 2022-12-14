import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants";
import { TimerContext } from "../components/timers/TimerProvider";
import { calcWorkoutTime } from "../utils/helpers";
import HistoryComponent from "../components/documentation/HistoryComponent";
import TimerBtn from "../components/generic/TimerBtn";


const Container = styled.div`
  width: 65%;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 2rem;
`;

const History = () => {
  const navigate = useNavigate();
  const { timers, history, setHistory, searchParams, setSearchParams } = useContext(TimerContext);

  return (
    <Container>
      <Title>History</Title>
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      {history.length == 0 && <p>No workouts completed</p>}
      {history.map((workout, i) => {
        return (
          <div key={`w-${i}`} className="history-wrapper">
            <HistoryComponent workout={workout} />
          </div>
        );
      })
      }
    </Container>
  );
};

export default History;
