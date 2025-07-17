import React from 'react';
import { Chip, Avatar } from '@material-ui/core';

const AvatarTag = ({ option, ...rest }) => {
  return (
    <Chip
      key={option.id}
      avatar={<Avatar alt={option.avatar?.name} src={option.avatar?.photo} />}
      variant="outlined"
      label={option.email}
      size="small"
      {...rest}
    />
  );
};

export default AvatarTag;
