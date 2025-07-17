import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchBoardById } from '../board/BoardSlice';

const memberAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.email.localeCompare(b.email),
});

export const initialState = memberAdapter.getInitialState({
  dialogMember: null,
  memberListOpen: false,
});

export const slice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    addBoardMembers: memberAdapter.addMany,
    removeBoardMember: memberAdapter.removeOne,
    setDialogMember: (state, action) => {
      state.dialogMember = action.payload;
    },
    setMemberListOpen: (state, action) => {
      state.memberListOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      memberAdapter.setAll(state, action.payload.members);
    });
  },
});

export const {
  addBoardMembers,
  removeBoardMember,
  setDialogMember,
  setMemberListOpen,
} = slice.actions;

const memberSelectors = memberAdapter.getSelectors((state) => state.member);

export const {
  selectAll: selectAllMembers,
  selectEntities: selectMembersEntities,
  selectTotal: selectMembersTotal,
} = memberSelectors;

export default slice.reducer;
