import React from 'react';
import styled from '@emotion/styled';
import {COLUMN_COLOR, R50, T50} from '../../../utils/colors';
import {barHeight, grid, taskWidth} from '../../const';
import {Droppable} from 'react-beautiful-dnd';
import Task from './Task';
import AddTask from './AddTask';
import {css} from '@emotion/core';
import usePermission from "../../hooks/usePermission";

export const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) {
    return R50;
  }
  if (isDraggingFrom) {
    return T50;
  }
  return COLUMN_COLOR;
};

const Wrapper = styled.div`
  background-color: ${(props) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: ${taskWidth}px;
  heigh: 50px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const Container = styled.div``;

const InnerTaskList = ({tasks}) => (
  <>
    {tasks.map((task, index) => (
      <Task key={task.id} task={task} index={index}/>
    ))}
  </>
);

const InnerList = ({columnId, tasks, dropProvided, index}) => (
  <Container>
    <DropZone
      data-testid="drop-zone"
      ref={dropProvided.innerRef}
      css={css`
        max-height: calc(100vh - ${barHeight * 5}px);
        overflow-y: scroll;
      `}
    >
      <InnerTaskList tasks={tasks}/>
      {dropProvided.placeholder}
    </DropZone>
    <AddTask columnId={columnId} index={index}/>
  </Container>
);

const TaskList = ({columnId, listType, tasks: tasks, index}) => {
  const {permissions} = usePermission()
  return (
    <Droppable isDropDisabled={!permissions.includes("core.change_board")} droppableId={columnId.toString()}
               type={listType}>
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <InnerList columnId={columnId} tasks={tasks} dropProvided={dropProvided} index={index}/>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default TaskList;
