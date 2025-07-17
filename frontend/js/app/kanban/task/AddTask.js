/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {Button} from '@material-ui/core';
import {N80A, N900} from '../../../utils/colors';
import {css} from '@emotion/core';
import {useDispatch} from 'react-redux';
import {setCreateDialogColumn, setCreateDialogOpen} from './TaskSlice';
import {useTranslation} from 'react-i18next';
import usePermission from "../../hooks/usePermission";

const AddTask = ({columnId, index}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {permissions} = usePermission()
  const handleOnClick = () => {
    dispatch(setCreateDialogColumn(columnId));
    dispatch(setCreateDialogOpen(true));
  };

  return (
    <>
      {permissions.includes("core.change_board") && (<Button
        css={css`
        text-transform: inherit;
        color: ${N80A};
        padding: 4px 0;
        margin-top: 6px;
        margin-bottom: 6px;
        &:hover {
          color: ${N900};
        }
        &:focus {
          outline: 2px solid #aaa;
        }
        .MuiButton-iconSizeMedium > *:first-of-type {
          font-size: 12px;
        }
      `}
        onClick={handleOnClick}
        fullWidth
      >
        {t('Add card')}
      </Button>)}
    </>
  );
};

export default AddTask;
