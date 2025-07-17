import React, {useState} from 'react';
import {Box, Popover} from '@material-ui/core';
import styled from '@emotion/styled';
import UserSearch from '../components/UserSearch';
import {API_BOARDS} from '../../../constants/api';
import api from '../../../api';
import {Button} from "react-bootstrap"
import {useDispatch} from 'react-redux';
import {addBoardMembers} from '../member/MemberSlice';
import {useTranslation} from 'react-i18next';
import usePermission from "../../hooks/usePermission";

const InviteMember = styled.div`
  margin-left: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const MemberInvite = ({boardId}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagsValue, setTagsValue] = useState([]);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {permissions} = usePermission()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postInviteMember = async (users) => {
    try {
      const response = await api.post(`${API_BOARDS}${boardId}/invite_member/`, {users});
      const newMembers = response.data;
      dispatch(addBoardMembers(newMembers));
      handleClose();
      setTagsValue([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickInvite = () => {
    postInviteMember(tagsValue.map((v) => v.id));
  };

  return (
    <>
      <div className="mr-0">
        {permissions.includes("core.change_board") && (<Button
          className="btn primary px-5 mx-4"
          onClick={handleClick}
          aria-controls="member-invite-menu"
          aria-haspopup="true"
          data-testid="member-invite"
        >
          {t('Invite')}
        </Button>)}
      </div>
      <Popover
        id="member-invite-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transitionDuration={0}
      >
        <Content>
          <Description>Invite to this board</Description>
          <Box display="flex" alignItems="center">
            <UserSearch boardId={boardId} tagsValue={tagsValue} setTagsValue={setTagsValue}/>
            <button
              className="btn btn-outline px-5 ml-4"
              onClick={handleClickInvite}
              data-testid="invite-selected"
              disabled={tagsValue.length === 0}
            >
              {t('Invite')}
            </button>
          </Box>
        </Content>
      </Popover>
    </>
  );
};

export default MemberInvite;
