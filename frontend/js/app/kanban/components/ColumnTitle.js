import React, {useEffect, useRef, useState} from 'react';
import {Key} from '../../const';
import {TextareaAutosize} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {Dropdown} from "react-bootstrap"
import {deleteColumn, patchColumn} from '../column/ColumnSlice';
import {setCreateDialogColumn, setCreateDialogOpen} from "../task/TaskSlice";
import usePermission from "../../hooks/usePermission";


const ColumnTitle = ({id, title, tasksCount, ...props}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pendingTitle, setPendingTitle] = useState(title);
  const [editing, setEditing] = useState(false);
  const titleTextAreaRef = useRef(null);
  const {permissions} = usePermission()
  const handleOnClickAdd = () => {
    dispatch(setCreateDialogColumn(id));
    dispatch(setCreateDialogOpen(true));
  };


  useEffect(() => {
    if (!editing && title === pendingTitle) {
      titleTextAreaRef?.current?.blur();
    }
  }, [pendingTitle, editing]);

  const handleKeyDown = (e) => {
    if (e.keyCode === Key.Enter) {
      e.preventDefault();
      if (pendingTitle.length > 0) {
        titleTextAreaRef?.current?.blur();
      }
    }
    if (e.keyCode === Key.Escape) {
      e.preventDefault();
      setPendingTitle(title);
      setEditing(false);
      // blur via useEffect
    }
  };

  const handleSave = () => {
    if (editing && pendingTitle.length > 0) {
      setEditing(false);
      if (pendingTitle !== title) {
        dispatch(patchColumn({id, fields: {title: pendingTitle}}));
      }
    }
  };

  const handleChange = (e) => {
    setPendingTitle(e.target.value);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure? Deleting the column will also delete related tasks and this cannot be undone.'
      )
    ) {
      dispatch(deleteColumn(id));
      handleOptionsClose();
    }
  };

  return (
    <div className="d-flex justify-content-between" {...props}>
      {editing ? (
        <div className="InputTitle">
          <TextareaAutosize
            ref={titleTextAreaRef}
            value={pendingTitle}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            data-testid="column-title-textarea"
            onFocus={handleFocus}
            autoFocus
          />
        </div>
      ) : (
        <div className="text-primary h5 align-self-center" onClick={() => setEditing(true)}>{pendingTitle}</div>
      )}
      <div className=" d-flex align-items-center">
        <div className="badge badge-pill badge-primary">{tasksCount}</div>
        {permissions.includes("core.change_board") && (<Dropdown>
          <Dropdown.Toggle
            className="p-2"
            size="sm"
            id={`column-${id}`}
            variant="btn btn-primary-outline">
            <i className="fa fa-ellipsis-v fa-5x text-primary"/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOnClickAdd}>Add task</Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={handleDelete}>Delete column</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>)}
      </div>
    </div>
  );
};

export default ColumnTitle;
