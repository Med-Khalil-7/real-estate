import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import api from '../../../api';
import { API_COMMENTS } from '../../../constants/api';

export const fetchComments = createAsyncThunk(
  'comment/fetchCommentsStatus',
  async (taskId, { dispatch }) => {
    try {
      const response = await api.get(`${API_COMMENTS}?task=${taskId}`);
      return response.data;
    } catch (err) {
      dispatch(createErrorToast(err.message));
      return [];
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createCommentStatus',
  async (comment, { dispatch }) => {
    try {
      const response = await api.post(API_COMMENTS, comment);
      return response.data;
    } catch (err) {}
  }
);

export const deleteComment = createAsyncThunk(
  'task/deleteCommentStatus',
  async (id, { dispatch }) => {
    try {
      await api.delete(`${API_COMMENTS}${id}/`);
      dispatch(createInfoToast('Comment deleted'));
      return id;
    } catch (err) {
      dispatch(createErrorToast(err.message));
    }
  }
);

const commentAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.created.localeCompare(a.created),
});

export const initialState = commentAdapter.getInitialState({
  fetchCommentsStatus: 'idle',
  createCommentStatus: 'idle',
});

export const slice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.fetchCommentsStatus = 'loading';
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      commentAdapter.addMany(state, action.payload);
      state.fetchCommentsStatus = 'succeeded';
    });
    builder.addCase(createComment.pending, (state) => {
      state.createCommentStatus = 'loading';
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      commentAdapter.addOne(state, action.payload);
      state.createCommentStatus = 'succeeded';
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      commentAdapter.removeOne(state, action.payload);
    });
  },
});

// selectors
export const { selectAll: selectAllComments } = commentAdapter.getSelectors(
  (state) => state.comment
);
export const selectFetchCommentsStatus = (state) => state.comment.fetchCommentsStatus;
export const selectCreateCommentStatus = (state) => state.comment.createCommentStatus;

export default slice.reducer;
