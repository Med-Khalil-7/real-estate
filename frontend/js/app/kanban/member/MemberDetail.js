import React from 'react';
import {css, keyframes} from '@emotion/core';
import {useDispatch} from 'react-redux';
import {setDialogMember} from '../member/MemberSlice';

const scaleUp = keyframes`
    0% {
        transform: scale(1.0);
    }
    100% {
        transform: scale(1.15);
    }
`;

const animationStyles = css`
  animation: 0.2s ${scaleUp} forwards;
`;

const MemberDetail = ({member}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setDialogMember(member.id));
  };

  return (
    <div className="text-avatar" style={{cursor:"pointer"}} onClick={handleClick} data-toggle="tooltip" data-placement="top"
         title="4 More Peoples"> {member.email.charAt(0)}</div>
  );
};

export default MemberDetail;
