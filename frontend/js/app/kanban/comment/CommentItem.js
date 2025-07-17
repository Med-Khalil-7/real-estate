import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import MemberAvatar from '../components/MemberAvatar';
import { formatDistanceToNow } from 'date-fns';
import { selectMembersEntities } from '../member/MemberSlice';
import React from 'react';
import { deleteComment } from './CommentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { HINT } from '../../../utils/colors';
import { useTranslation } from 'react-i18next';

const CommentActionRow = ({ comment }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /*  const user = useSelector((state) => state.auth.user); */
  const memberEntities = useSelector(selectMembersEntities);
  const author = memberEntities[comment.author];

  /*   if (!user || !author || user.id !== author.id) {
    return null;
  } */

  const handleDelete = () => {
    dispatch(deleteComment(comment.id));
  };

  return (
    <Box>
      <Link onClick={handleDelete} data-testid={`delete-comment-${comment.id}`}>
        {t('Delete')}
      </Link>
    </Box>
  );
};

const CommentItem = ({ comment }) => {
  const memberEntities = useSelector(selectMembersEntities);
  const author = memberEntities[comment.author];

  if (!author) {
    return null;
  }

  return (
    <Box display="flex" mb={2}>
      <Box marginRight={2} mt={0.25}>
        <MemberAvatar member={author} />
      </Box>
      <Box>
        <Box display="flex between">
          <Name>{author.first_name || author.email}</Name>
          <TimeAgo>
            {formatDistanceToNow(new Date(comment.created), {
              addSuffix: true,
            })}
          </TimeAgo>
        </Box>
        <Text>{comment.text}</Text>
        {CommentActionRow({ comment })}
      </Box>
    </Box>
  );
};

const Link = styled.a`
  font-size: 0.75rem;
  color: ${HINT};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Name = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
`;

const Text = styled.p`
  font-size: 0.75rem;
  margin-top: 4px;
`;

const TimeAgo = styled.div`
  font-size: 0.75rem;
  color: ${HINT};
  margin-left: 8px;
`;

export default CommentItem;
