import React, { useState } from 'react';
import {
  Dialog,
  Avatar,
  Button,
  Fab,
  useMediaQuery,
  useTheme,
  DialogTitle,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../../../api';
import { API_BOARDS } from '../../../constants/api';

import { useDispatch, useSelector } from 'react-redux';
import { removeBoardMember, setDialogMember, selectMembersEntities } from '../member/MemberSlice';
import { currentBoardOwner } from '../board/BoardSlice';
import Close from '../components/Close';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem 2rem 2rem;
  ${(props) => props.theme.breakpoints.down('xs')} {
    flex-direction: column;
  }
`;

const PrimaryText = styled.h3`
  margin-top: 0;
  word-break: break-all;
`;

const Main = styled.div`
  margin-left: 2rem;
  font-size: 16px;
`;

const SecondaryText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777;
  word-break: break-all;
`;

const ConfirmAction = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MemberDialog = ({ board }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const memberId = useSelector((state) => state.member.dialogMember);
  const members = useSelector(selectMembersEntities);
  const boardOwner = useSelector((state) => currentBoardOwner(state));
  const xsDown = useMediaQuery(theme.breakpoints.down('xs'));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const member = memberId === null ? null : members[memberId];
  const memberIsOwner = member?.id === board.owner;
  const open = member !== null;

  if (!member) {
    return null;
  }

  const handleClose = () => {
    dispatch(setDialogMember(null));
    setConfirmDelete(false);
  };

  const handleRemoveMember = async () => {
    try {
      const response = await api.post(`${API_BOARDS}${board.id}/remove_member/`, {
        email: member.email,
      });
      const removedMember = response.data;
      dispatch(removeBoardMember(removedMember.id));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth fullScreen={xsDown}>
      <Close onClose={handleClose} />
      <DialogTitle id="member-detail">Member</DialogTitle>
      <Container theme={theme}>
        {confirmDelete ? (
          <div>
            <Alert
              severity="error"
              css={css`
                margin-bottom: 2rem;
              `}
            >
              Are you sure you want to remove this member? This member will be removed from all
              cards.
            </Alert>
            <ConfirmAction>
              <Fab
                size="small"
                onClick={() => setConfirmDelete(false)}
                css={css`
                  box-shadow: none;
                  &.MuiFab-sizeSmall {
                    width: 32px;
                    height: 32px;
                  }
                `}
              >
                <FontAwesomeIcon icon={faAngleLeft} color="#555" />
              </Fab>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleRemoveMember}
                css={css`
                  font-size: 0.625rem;
                `}
              >
                Remove member
              </Button>
            </ConfirmAction>
          </div>
        ) : (
          <>
            <Avatar
              css={css`
                height: 6rem;
                width: 6rem;
                font-size: 36px;
                margin-bottom: 1rem;
              `}
              src={member?.avatar?.photo}
              alt={member?.avatar?.name}
            >
              {member.email.charAt(0)}
            </Avatar>
            <Main>
              <PrimaryText>
                {member.first_name} {member.last_name}
              </PrimaryText>
              <SecondaryText>
                email: <b>{member.email}</b>
              </SecondaryText>
              <SecondaryText
                css={css`
                  margin-bottom: 1.5rem;
                `}
              ></SecondaryText>
              {memberIsOwner && <Alert severity="info">Owner of this board</Alert>}
              {boardOwner && !memberIsOwner && (
                <Button
                  size="small"
                  css={css`
                    color: #333;
                    font-size: 0.625rem;
                  `}
                  variant="outlined"
                  onClick={() => setConfirmDelete(true)}
                >
                  Remove from board
                </Button>
              )}
            </Main>
          </>
        )}
      </Container>
    </Dialog>
  );
};

export default MemberDialog;
