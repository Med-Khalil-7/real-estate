import React from 'react';
import styled from '@emotion/styled';
import {useDispatch, useSelector} from 'react-redux';
import {barHeight} from '../../const';
import {css} from '@emotion/core';
import MemberInvite from '../member/MemberInvite';
import MemberDetail from '../member/MemberDetail';
import {currentBoardOwner} from './BoardSlice';
import {PRIMARY} from '../../../utils/colors';
import {addColumn} from '../column/ColumnSlice';
import {Link, useParams} from 'react-router-dom';
import {selectAllMembers} from '../member/MemberSlice';
import MemberFilter from '../member/MemberFilter';
import {useTranslation} from 'react-i18next';
import {Button} from "react-bootstrap"
import usePermission from "../../hooks/usePermission";
import MemberDialog from "../member/MemberDialog";
import MemberListDialog from "../member/MemberList";
import EditTaskDialog from "../task/EditTaskDialog";
import CreateTaskDialog from "../task/CreateTaskDialog";

const Container = styled.div`
  height: ${barHeight}px;
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

const Items = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: scroll;
`;

const Left = styled.div`
  white-space: nowrap;
  display: flex;
  margin-right: 1rem;
`;

const Right = styled.div`
  white-space: nowrap;
`;

const Name = styled.div`
  color: #6869f6;
`;

const buttonStyles = css`
  color: ${PRIMARY};
  .MuiButton-iconSizeSmall > *:first-of-type {
    font-size: 12px;
  }
`;

const BoardBar = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const error = useSelector((state) => state.board.detailError);
  const detail = useSelector((state) => state.board.detail);
  const boardOwner = useSelector(currentBoardOwner);
  const {id} = useParams();
  const detailDataExists = detail?.id.toString() === id;
  const {t} = useTranslation();
  const {permissions} = usePermission()

  if (!detailDataExists || error || !detail) {
    return null;
  }

  const handleAddColumn = () => {
    dispatch(addColumn(detail.id));
  };

  return (
    <div className="d-flex flex-column justify-content-between flex-md-row align-items-center flex-wrap pb-3">

      <div className="wrapper d-flex align-items-center">
        <h4 className="mb-md-0 mb-4 text-dark">{detail.name}</h4>
        <div className="image-grouped align-items-center mx-md-4">
          {members.map((member) => (
            <MemberDetail key={member.id} member={member} isOwner={detail.owner === member.id}/>
          ))}
          {boardOwner && <MemberInvite boardId={detail.id}/>}
          <MemberFilter boardId={detail.id}/>
        </div>
      </div>
      <div className=" d-none d-lg-flex flex-column flex-md-row kanban-toolbar mx-md-0 my-2">
        <div className="d-flex">
          <Button as={Link} to="/boards" className="btn btn-primary">{t("Boards")}</Button>
        </div>
        <div className="d-flex mt-4 mt-md-0">
          {permissions.includes("core.change_board") &&
            <button type="button" className="btn btn-success" onClick={handleAddColumn}>{t('Add Column')}</button>}
          <button type="button" className="btn btn-icons bg-white">
            <i className="mdi mdi-view-grid"/>
          </button>
          <button type="button" className="btn btn-icons bg-white mx-0">
            <i className="mdi mdi-menu"/>
          </button>
        </div>
      </div>
      <MemberDialog board={detail}/>
      {/*Modals*/}
      {/* TODO: @mzekri-madar Convert from material to bootstrap */}
      <MemberListDialog/>
      <EditTaskDialog/>
      <CreateTaskDialog/>
    </div>
  );
};

export default BoardBar;
