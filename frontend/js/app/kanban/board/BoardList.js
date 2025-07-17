import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllBoards, setCreateDialogOpen} from './BoardSlice';
import NewBoardDialog from './NewBoardDialog';
import {format} from "date-fns"
import {Link} from "react-router-dom"


const Card = ({board}) => {
  return (
    <div
      className="col-md-4 mb-4 "
    >
      <div className="kanban-board-card d-flex d-flex-between pb-2 flex-column">
        <div className="d-flex justify-content-between w-100">
          <div><h4 className="text-dark">{board.name}</h4></div>
          <div
            className="task-date text-small text-primary">{format(new Date(board.created), 'MM/dd/yyyy')}</div>
        </div>
        <p
          className="kanban-board-description text-wrap mt-2 text-small text-info">{board?.description ? `${board.description.slice(0, 100)}...` : 'No description provided.'}</p>
        <div className="d-flex align-items-center justify-content-between">
          <div className="wrapper  d-flex align-items-center">
            <div className="image-grouped">
              {board.members.map((member, idx) => (
                <div key={`member-${member}-${idx}`} className="text-avatar"
                     data-toggle="tooltip" data-placement="top"
                     title="4 More Peoples"> {member.charAt(0)}</div>
              ))}
            </div>
          </div>
        </div>
        <Link className="align-self-end" as={Link} to={`/boards/${board.id}`}><i
          className=" h1 text-primary mdi mdi-login-variant"/>
        </Link>
      </div>
    </div>
  );
};

const BoardList = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.board.fetchLoading);
  const boards = useSelector((state) => state.board.all);

  React.useEffect(() => {
    dispatch(fetchAllBoards());

    const handleKeydown = (e) => {
      if (e.key === 'b' && e.metaKey) {
        dispatch(setCreateDialogOpen(true));
      }
    };

    document.addEventListener('keydown', (e) => handleKeydown(e));
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  if (loading && boards.length === 0) {
    return (<div className="loader-demo-box">
      <div className="flip-square-loader mx-auto"/>
    </div>)
  }

  return (
    <div>
      <div className="align-self-end" key="new-board">
        <NewBoardDialog/>
      </div>
      <div className="container">
        <div className="row">
          {boards.map((board) => {
            return (
              <Card key={board.id} board={board} isOwner>
              </Card>
            );
          })}
          {/*    */}
        </div>
      </div>
    </div>
  );
};

export default BoardList;
