import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardById } from '../board/BoardSlice';
import api from '../../../api';
import { addColumn, deleteColumn } from '../column/ColumnSlice';
import { API_TASKS, API_SORT_TASKS } from '../../../constants/api';
import { removeBoardMember } from '../member/MemberSlice';

export const initialState = {
  byColumn: {},
  byId: {},
  createLoading: false,
  createDialogOpen: false,
  createDialogColumn: null,
  editDialogOpen: null,
};

export const patchTask = createAsyncThunk('task/patchTaskStatus', async ({ id, fields }) => {
  const response = await api.patch(`${API_TASKS}${id}/`, fields);
  return response.data;
});

export const createTask = createAsyncThunk(
  'task/createTaskStatus',
  async (task, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`${API_TASKS}`, task);
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTask = createAsyncThunk('task/deleteTaskStatus', async (id, { dispatch }) => {
  await api.delete(`${API_TASKS}${id}/`);
  return id;
});

export const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasksByColumn: (state, action) => {
      state.byColumn = action.payload;
    },
    setCreateDialogOpen: (state, action) => {
      state.createDialogOpen = action.payload;
    },
    setCreateDialogColumn: (state, action) => {
      state.createDialogColumn = action.payload;
    },
    setEditDialogOpen: (state, action) => {
      state.editDialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const byColumn = {};
      const byId = {};
      for (const col of action.payload.columns) {
        for (const task of col.tasks) {
          byId[task.id] = task;
        }
        byColumn[col.id] = col.tasks.map((t) => t.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    });
    builder.addCase(patchTask.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
    });
    builder.addCase(createTask.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.byColumn[action.payload.column].push(action.payload.id);
      state.createDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createTask.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.byColumn[action.payload.id] = [];
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      delete state.byColumn[action.payload];
    });

    builder.addCase(removeBoardMember, (state, action) => {
      const deletedMemberId = action.payload;
      for (const taskId in state.byId) {
        const task = state.byId[taskId];
        task.assignees = task.assignees.filter((assigneeId) => assigneeId !== deletedMemberId);
      }
    });
  },
});

export const {
  setTasksByColumn,
  setCreateDialogOpen,
  setCreateDialogColumn,
  setEditDialogOpen,
} = slice.actions;

export const updateTasksByColumn = (tasksByColumn) => async (dispatch, getState) => {
  const state = getState();
  const previousTasksByColumn = state.task.byColumn;
  const boardId = state.board.detail?.id;
  try {
    dispatch(setTasksByColumn(tasksByColumn));
    await api.post(API_SORT_TASKS, {
      board: boardId,
      tasks: tasksByColumn,
      order: Object.values(tasksByColumn).flat(),
    });
  } catch (err) {
    dispatch(setTasksByColumn(previousTasksByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
