import React from 'react';
import styled from '@emotion/styled';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Column from '../column/Column';
import reorder, {reorderTasks} from 'utils/reorder';
import {useDispatch, useSelector} from 'react-redux';
import {updateTasksByColumn} from '../task/TaskSlice';
import {columnSelectors, updateColumns} from '../column/ColumnSlice';
import {useParams} from 'react-router-dom';
import {fetchBoardById} from './BoardSlice';
import Spinner from '../components/Spinner';
import {barHeight, sidebarWidth} from '../../const';
import BoardBar from './BoardBar';
import {useTranslation} from 'react-i18next';

const BoardContainer = styled.div`
  min-width: calc(100vw - ${sidebarWidth});
  min-height: calc(100vh - ${barHeight * 2}px);
  overflow-x: scroll;
  display: flex;
`;

const ColumnContainer = styled.div`
  display: inline-flex;
  width: 100%;
`;

const EmptyBoard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const ColumnsBlock = styled.div``;

const RightMargin = styled.div`
  /*
  With overflow-x the right-margin of the rightmost column is hidden.
  This is a dummy element that fills up the space to make it
  seem like there's some right margin.
   */
  &:after {
    content: '';
    display: block;
    width: 0.5rem;
  }
`;

const Board = () => {
  const detail = useSelector((state) => state.board.detail);
  const error = useSelector((state) => state.board.detailError);
  const columns = useSelector(columnSelectors.selectAll);
  const tasksByColumn = useSelector((state) => state.task.byColumn);
  const tasksById = useSelector((state) => state.task.byId);
  const dispatch = useDispatch();
  const {id} = useParams();
  const {t, i18n} = useTranslation();
  const scrollRef = React.useRef(null);
  const {language} = i18n


  React.useEffect(() => {
    if (id) {
      dispatch(fetchBoardById({boardId: id}));
    }
  }, [id]);


  const scroll = (scrollOffset) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };
  const onDragEnd = (result) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const newOrdered = reorder(columns, source.index, destination.index);
      dispatch(updateColumns(newOrdered));
      return;
    }

    const data = reorderTasks({
      tasksByColumn,
      source,
      destination,
    });
    dispatch(updateTasksByColumn(data.tasksByColumn));
  };

  const detailDataExists = detail?.id.toString() === id;

  if (error) {
    return <PageError>{error}</PageError>;
  }

  if (!detailDataExists) {
    return <Spinner loading={!detailDataExists}/>;
  }


  return (
    <>
      <BoardBar/>

      {columns.length !== 0 ? (<>
          {columns.length > 3 && (
            <div className="d-flex justify-content-between mb-2">
              {/* HACK: this is garbage we need a better implementation of the scroll arrows */}
              {language === "ar" ?
                (<>
                  <button className="btn btn-sm btn-primary btn-icon" onClick={() => scroll(400)}><i
                    className="mdi mdi-arrow-right"/>
                  </button>
                  <button className="btn btn-sm btn-primary btn-icon" onClick={() => scroll(-400)}><i
                    className="mdi mdi-arrow-left"/>
                  </button>
                </>) :
                (<>
                  <button className="btn btn-sm btn-primary btn-icon" onClick={() => scroll(-400)}><i
                    className="mdi mdi-arrow-left"/>
                  </button>
                  <button className="btn btn-sm btn-primary btn-icon" onClick={() => scroll(400)}><i
                    className="mdi mdi-arrow-right"/>
                  </button>
                </>)
              }
            </div>
          )}
          <div className="horizontal-scrollable">
            <div className=" row" ref={scrollRef}>
              <div className="col-md-12">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="board" type="COLUMN" direction="horizontal">
                    {(provided) => (
                      <div className="d-flex" ref={provided.innerRef} {...provided.droppableProps}>
                        {columns.map((column, index) => (
                          <Column
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            index={index}
                            tasks={tasksByColumn[column.id].map((taskId) => tasksById[taskId])}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
              <RightMargin/>
            </div>
          </div>
        </>
      ) : (
        <EmptyBoard>{t('This board is empty.')}</EmptyBoard>
      )}
    </>
  );
};

export default Board;
