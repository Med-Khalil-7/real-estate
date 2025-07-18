import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Avatar, Button, Popover } from '@material-ui/core';
import AssigneeAutoComplete from '../components/AssigneeAutoComplete';
import { useTranslation } from 'react-i18next';
import Close from '../components/Close';
import { modalPopperIndex, modalPopperWidth } from '../../const';
import { selectAllMembers, selectMembersEntities } from '../member/MemberSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PRIMARY } from '../../../utils/colors';
import { patchTask } from './TaskSlice';

const Container = styled.div`
  margin-bottom: 1rem;
`;

const ContentTitle = styled.h3`
  margin: 0.5rem 1rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: normal;
`;

const Content = styled.div`
  border-bottom: 1px solid #e1e4e8;
  padding: 8px 0;
  width: ${modalPopperWidth}px;
`;

const AssigneeContainer = styled.div`
  padding: 16px;
`;

const Label = styled.p`
  color: #757575;
  margin: 0;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  overflow-wrap: anywhere;
`;

const TaskAssignees = ({ task }) => {
  const dispatch = useDispatch();
  const membersById = useSelector(selectMembersEntities);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingAssignees, setPendingAssignees] = useState([]);
  const members = useSelector(selectAllMembers);
  const { t } = useTranslation();
  const assignees = task.assignees.map((id) => membersById[id]);

  const handleClick = (event) => {
    setPendingAssignees(assignees);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    const currentIds = assignees.map((a) => a.id);
    const pendingIds = pendingAssignees.map((member) => member.id);
    if (
      !(
        pendingIds.length === currentIds.length &&
        pendingIds.sort().every((value, index) => value === currentIds.sort()[index])
      )
    ) {
      dispatch(
        patchTask({
          id: task.id,
          fields: { assignees: pendingIds },
        })
      );
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'task-assignees-popover' : undefined;

  return (
    <Container>
      <Label>{t('Assignees')}</Label>
      {assignees.map((assignee) => (
        <List key={assignee.id}>
          <div>
            <Avatar
              css={css`
                height: 2rem;
                width: 2rem;
                margin-right: 0.5rem;
              `}
              src={assignee.avatar?.photo}
              alt={assignee.avatar?.name}
            >
              {assignee.email.charAt(0)}
            </Avatar>
          </div>
          <div>{assignee.email}</div>
        </List>
      ))}
      <Button
        size="small"
        onClick={handleClick}
        data-testid="open-edit-assignees"
        css={css`
          color: ${PRIMARY};
          font-size: 0.7rem;
        `}
      >
        {t('Change')}
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        transitionDuration={0}
        style={{ zIndex: modalPopperIndex }}
        onClose={handleClose}
        css={css`
          .MuiPaper-rounded {
            border-radius: 0;
          }
        `}
      >
        <Content>
          <Close onClose={handleClose} onPopper />
          <ContentTitle>{t('Assigned board members')}</ContentTitle>
          <AssigneeContainer>
            <AssigneeAutoComplete
              assignee={pendingAssignees}
              members={members}
              setAssignee={setPendingAssignees}
              controlId="assignee-select"
              dataTestId={'edit-assignees'}
            />
          </AssigneeContainer>
        </Content>
      </Popover>
    </Container>
  );
};

export default TaskAssignees;
