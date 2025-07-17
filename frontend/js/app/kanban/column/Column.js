import styled from '@emotion/styled';
import {grid} from '../../const';
import React from 'react';
import {Droppable} from 'react-beautiful-dnd';
import {useTranslation} from "react-i18next"
import ColumnTitle from "../components/ColumnTitle";
import Task from "../task/Task";

const Container = styled.div`
  margin: ${grid / 2}px;
  display: flex;
  flex-direction: column;
  border-top: 3px solid #cfd3dc;
`;

const Header = styled.div`
  transition: background-color 0.2s ease;
  [data-rbd-drag-handle-context-id='0'] {
    cursor: initial;
  }
`;

const Column = ({id, title, tasks, index}) => {
  const {t} = useTranslation();


  return (
    /*    <Draggable draggableId={`col-${id}`} index={index}>
          {(provided, snapshot) => (
            <Container
              ref={provided.innerRef}
              {...provided.draggableProps}
              data-testid={`col-${title}`}
            >
              <Header isDragging={snapshot.isDragging}>
                <ColumnTitle
                  {...provided.dragHandleProps}
                  id={id}
                  title={title}
                  tasksCount={tasks.length}
                  aria-label={`${title} task list`}
                  data-testid="column-title"
                />
              </Header>
              <TaskList columnId={id} listType="TASK" tasks={tasks} index={index}/>
            </Container>
          )}
        </Draggable>*/


    <div
      className="col-md-4 ">
      <div className="board-wrapper p-3">
        <Header>
          <div className="board-portlet">
            <ColumnTitle
              id={id}
              title={title}
              tasksCount={tasks.length}
              aria-label={`${title} task list`}
              data-testid="column-title"
            />
          </div>
        </Header>
        <Droppable droppableId={id}>
          {providedInner => (
            <div className="kanbanHeight d-flex flex-column"
                 ref={providedInner.innerRef}
                 {...providedInner.droppableProps}
            >  {tasks.map((task, index) =>
              <Task key={task.id} task={task} index={index}/>)}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
