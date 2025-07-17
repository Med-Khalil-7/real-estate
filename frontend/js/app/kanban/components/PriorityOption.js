import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { PRIO_COLORS } from '../../const';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const PrioLabel = styled.div`
  margin-left: 1rem;
`;

const PriorityOption = ({ option }) => {
  return (
    <Container>
      <FontAwesomeIcon
        icon={faArrowUp}
        color={PRIO_COLORS[option.value]}
        data-testid="priority-icon"
      />
      <PrioLabel>{option.label}</PrioLabel>
    </Container>
  );
};

export default PriorityOption;
