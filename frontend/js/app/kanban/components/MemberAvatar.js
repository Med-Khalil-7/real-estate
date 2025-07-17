import { Avatar } from '@material-ui/core';
import React from 'react';
import { avatarStyles } from '../../styles';

const MemberAvatar = ({ member }) => {
  return (
    <Avatar css={avatarStyles} src={member?.avatar?.photo} alt="member-avatar">
      {member?.username?.charAt(0) || '-'}
    </Avatar>
  );
};

export default MemberAvatar;
