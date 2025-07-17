import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BOARDS } from '../../../constants/api';
import api from '../../../api';
export const initialState = {
  detail: null,
  all: [],
  fetchLoading: true,
  fetchError: null,
  createDialogOpen: false,
  createLoading: false,
  createError: null,
  detailLoading: false,
  detailError: undefined,
};

export const fetchAllBoards = createAsyncThunk('board/fetchAllStatus', async () => {
  const response = await api.get(API_BOARDS);
  return response.data;
});

export const fetchBoardById = createAsyncThunk(
  'board/fetchByIdStatus',
  async (boardSearchQuery, { rejectWithValue }) => {
    try {
      const queryString = boardSearchQuery.assigneeIds
        ? `?assignees=${boardSearchQuery.assigneeIds}`
        : '';
      const response = await api.get(`${API_BOARDS}${boardSearchQuery.boardId}/${queryString}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBoard = createAsyncThunk('board/createBoardStatus', async (data) => {
  const response = await api.post(API_BOARDS, data);
  return response.data;
});

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setCreateDialogOpen: (state, action) => {
      state.createDialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBoards.pending, (state) => {
      state.fetchLoading = true;
      state.fetchError = null;
      state.detailError = undefined;
    });
    builder.addCase(fetchAllBoards.fulfilled, (state, action) => {
      state.all = action.payload;
      state.fetchError = null;
      state.fetchLoading = false;
    });
    builder.addCase(fetchAllBoards.rejected, (state, action) => {
      state.fetchError = action.payload;
      state.fetchLoading = false;
    });
    builder.addCase(fetchBoardById.pending, (state) => {
      state.detailLoading = true;
    });
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const { id, name, owner, members } = action.payload;
      state.detail = { id, name, owner, members };
      state.detailError = undefined;
      state.detailLoading = false;
    });
    builder.addCase(fetchBoardById.rejected, (state, action) => {
      state.detailError = action.payload;
      state.detailLoading = false;
    });
    builder.addCase(createBoard.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.all.push(action.payload);
      state.createError = null;
      state.createLoading = false;
      state.createDialogOpen = false;
    });
    builder.addCase(createBoard.rejected, (state, action) => {
      state.createError = action.payload;
      state.createLoading = false;
    });
  },
});

export const { setCreateDialogOpen } = boardSlice.actions;

export const currentBoardOwner = (state) => {
  return true;
};

export default boardSlice.reducer;
