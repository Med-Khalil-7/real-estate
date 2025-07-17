import { configureStore, combineReducers } from '@reduxjs/toolkit';
import BoardSlice from './app/kanban/board/BoardSlice';
import ColumnSlice from './app/kanban/column/ColumnSlice';
import TaskSlice from './app/kanban/task/TaskSlice';
import CommentSlice from './app/kanban/comment/CommentSlice';
import MemberSlice from './app/kanban/member/MemberSlice';

/* Cobine state slices */
export const rootReducer = combineReducers({
  board: BoardSlice,
  column: ColumnSlice,
  task: TaskSlice,
  comment: CommentSlice,
  member: MemberSlice,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: rootReducer,
});

export default store;
