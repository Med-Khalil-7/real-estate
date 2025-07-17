import React from "react";
import {Draggable} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import {setEditDialogOpen} from "./TaskSlice";
import {selectMembersEntities} from "../member/MemberSlice";
import {ProgressBar} from "react-bootstrap"
import {format} from "date-fns"
import {useTranslation} from "react-i18next"


const Task = ({task: task, style, index}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation()

  const handleClick = () => {
    dispatch(setEditDialogOpen(task.id));
  };

  const membersByIds = useSelector(selectMembersEntities);
  const assignees = task.assignees.map(
    (assigneeId) => membersByIds[assigneeId]
  );

  return (

    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div className="mt-2 board-portlet"
             {...provided.draggableProps}
             {...provided.dragHandleProps}
             ref={provided.innerRef}
        >
          <ul onClick={handleClick} id="portlet-card-list-1" className="portlet-card-list">
            <li className="portlet-card" style={{cursor: "pointer"}}>
              <ProgressBar variant={`primary`} now={25}/>
              <div className="d-flex justify-content-between w-100">
                <p className="task-date">{format(new Date(task.created), 'MM/dd/yyyy')}</p>
              </div>
              <div><h4 className="text-dark">{task.title}</h4></div>
              <p className="text-wrap text-small text-info">{task.description}</p>
              <div className="wrapper d-flex align-items-center">
                <div className="image-grouped">
                  {assignees.map((member) => (
                    <div key={`member-${member.id}`} className="text-avatar"
                         data-toggle="tooltip" data-placement="top"
                         title="4 More Peoples"> {member.email.charAt(0)}</div>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                {{
                  'L': <div className={"badge badge-inverse-" + "success"}>{t("Low priority")}</div>,
                  'H': <div className={"badge badge-inverse-" + "danger"}>{t("High priority")}</div>,
                  'M': <div className={"badge badge-inverse-" + "info"}>{t("Medium priority")}</div>,
                }[task.priority]}
                {/* <p className="due-date">{this.props.task.dueDate}</p>*/}
              </div>
            </li>
          </ul>
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(Task);
