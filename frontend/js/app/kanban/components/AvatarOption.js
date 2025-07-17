import React from 'react';
import { Avatar } from '@material-ui/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

const Username = styled.span`
  margin-left: 0.5rem;
  word-break: break-all;
`;

const AvatarOption = ({ option }) => {
  return (
    <>
      <Avatar
        css={css`
          height: 1.5rem;
          width: 1.5rem;
        `}
        alt={option.avatar?.name}
        src={option.avatar?.photo}
      />
      <Username>{option.email}</Username>
    </>
  );
};

export default AvatarOption;
