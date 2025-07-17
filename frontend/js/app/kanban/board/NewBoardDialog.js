import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {createBoard, setCreateDialogOpen} from './BoardSlice';
import {Alert} from '@material-ui/lab';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import usePermission from "../../hooks/usePermission";

const NewBoardDialog = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.board.createError);
  const open = useSelector((state) => state.board.createDialogOpen);
  const {register, handleSubmit, errors, reset} = useForm();
  const {t} = useTranslation();
  const {permissions} = usePermission()
  const handleOpen = () => {
    reset();
    dispatch(setCreateDialogOpen(true));
  };

  const handleClose = () => {
    dispatch(setCreateDialogOpen(false));
  };

  const onSubmit = handleSubmit((data) => {
    dispatch(createBoard(data));
  });

  return (
    <div className="p-2">
      {permissions.includes("core.add_board") && (
        <button className="btn btn-primary h1 lg btn-icon mb-2" onClick={handleOpen} data-testid="create-board-btn">
          <i className="mdi mdi-plus h1"/>
        </button>)}
      <Dialog open={open} onClose={handleClose} aria-labelledby="new-board" fullWidth maxWidth="xs">
        <DialogTitle id="new-board-title">{t('New board')}</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <DialogContentText>
              {t(
                'Create a new private board. Only members of the board will be able to see and edit it.'
              )}
            </DialogContentText>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              id="board-name"
              label={t('Board name')}
              fullWidth
              name="name"
              {...register('name', {
                required: 'This field is required',
                maxLength: {
                  value: 50,
                  message: "This field can't be more than 50 chars long.",
                },
              })}
              helperText={errors?.name?.message}
              error={Boolean(errors?.name)}
            />
            <TextField
              multiline
              autoFocus
              id="description"
              label={t('Description')}
              fullWidth
              name="description"
              {...register('description', {
                required: 'This field is required',
                maxLength: {
                  value: 225,
                  message: "This field can't be more than 255 chars long.",
                },
              })}
              helperText={errors?.description?.message}
              error={Boolean(errors?.description)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onSubmit} data-testid="create-board-btn">
              {t('Create board')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default NewBoardDialog;
