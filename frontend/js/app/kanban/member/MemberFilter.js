import {css} from '@emotion/core';
import styled from '@emotion/styled';
import {Box, Button, Popover} from '@material-ui/core';
import AssigneeAutoComplete from '../components/AssigneeAutoComplete';
import {fetchBoardById} from '../board/BoardSlice';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllMembers} from './MemberSlice';
import {useTranslation} from 'react-i18next';

const FilterButton = styled.div`
  margin-left: 0.5rem;
  border-color: #d1d8e2;
  border-radius: 12px;
`;

const Content = styled.div`
  padding: 2rem;
  width: 400px;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
  font-size: 0.875rem;
`;

const MemberFilter = ({boardId}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredAssignee, setFilteredAssignee] = useState([]);
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const {t} = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postFilterMember = async (users) => {
    dispatch(
      fetchBoardById({
        boardId: boardId,
        assigneeIds: users.map((m) => m.id),
      })
    );
    handleClose();
  };

  const handleClickFilter = () => {
    postFilterMember(filteredAssignee);
  };

  const handleClickClearFilter = () => {
    setFilteredAssignee([]);
    postFilterMember([]);
  };

  const ClearFilterButton = () => (
    <FilterButton>
      <button type="button" onClick={handleClickClearFilter} className="btn btn-icons bg-white d-none d-lg-block">
        <i className="mdi mdi-window-close"/>
      </button>
    </FilterButton>
  );

  return (
    <>
      <FilterButton>
        <button type="button" onClick={handleClick} className="btn btn-icons bg-white d-none d-lg-block">
          <i className="mdi mdi-filter-outline"/>
        </button>
      </FilterButton>
      {filteredAssignee.length > 0 ? <ClearFilterButton/> : null}
      <Popover
        id="member-filter-menu"
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
          <Description>{t('Filter tasks by assignees')}</Description>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              <AssigneeAutoComplete
                assignee={filteredAssignee}
                members={members}
                controlId={'assignee-filter'}
                dataTestId={'filter-assignees'}
                setAssignee={setFilteredAssignee}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              css={css`
                font-size: 0.625rem;
                margin-left: 0.5rem;
              `}
              onClick={handleClickFilter}
              data-testid="filter-selected"
              disabled={filteredAssignee.length === 0}
            >
              {t('Filter')}
            </Button>
          </Box>
        </Content>
      </Popover>
    </>
  );
};

export default MemberFilter;
