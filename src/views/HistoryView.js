import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants";
import DocumentComponent from "../components/documentation/DocumentComponent";
import { TimerContext } from "../components/timers/TimerProvider";

import TimerBtn from "../components/generic/TimerBtn";


const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2rem;
`;

const History = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useContext(TimerContext);

  return (
    <Container>
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      History page
    </Container>
  );
};

export default History;
