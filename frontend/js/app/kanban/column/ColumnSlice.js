import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardById } from '../board/BoardSlice';
import { API_SORT_COLUMNS, API_COLUMNS } from '../../../constants/api';
import api from '../../../api';

export const addColumn = createAsyncThunk('column/addColumnStatus', async (boardId) => {
  const response = await api.post(`${API_COLUMNS}`, {
    board: boardId,
    title: 'new column',
    tasks: [],
  });
  return response.data;
});

export const patchColumn = createAsyncThunk('column/patchColumnStatus', async ({ id, fields }) => {
  const response = await api.patch(`${API_COLUMNS}${id}/`, fields);
  return response.data;
});

export const deleteColumn = createAsyncThunk(
  'column/deleteColumnStatus',
  async (id, { dispatch }) => {
    await api.delete(`${API_COLUMNS}${id}/`);
    return id;
  }
);

const columnAdapter = createEntityAdapter({});

export const initialState = columnAdapter.getInitialState();

export const slice = createSlice({
  name: 'column',
  initialState,
  reducers: {
    setColumns: columnAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      columnAdapter.setAll(
        state,
        action.payload.columns.map((column) => ({
          id: column.id,
          title: column.title,
          board: action.payload.id,
        }))
      );
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      columnAdapter.addOne(state, action.payload);
    });
    builder.addCase(patchColumn.fulfilled, (state, action) => {
      columnAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { title: action.payload.title },
      });
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      columnAdapter.removeOne(state, action.payload);
    });
  },
});

export const { setColumns } = slice.actions;

export const columnSelectors = columnAdapter.getSelectors((state) => state.column);

export const {
  selectAll: selectAllColumns,
  selectEntities: selectColumnsEntities,
} = columnSelectors;

/**
 * Post the new order of columns.
 * If the request fails, restore the previous order of columns.
 */
export const updateColumns = (columns) => async (dispatch, getState) => {
  const previousColumns = selectAllColumns(getState());
  try {
    dispatch(setColumns(columns));
    await api.post(API_SORT_COLUMNS, {
      order: columns.map((col) => col.id),
    });
  } catch (err) {
    dispatch(setColumns(previousColumns));
  }
};

export default slice.reducer;
