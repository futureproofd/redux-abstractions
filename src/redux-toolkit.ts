import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v1 as uuid } from "uuid";
import { Todo } from './type';

// Reducers
const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
];

// createSlice will replace our action creators and action types
const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    edit: (state, action: PayloadAction<{ id: string, desc: string }>) => {
      const todoToEdit = state.find(todo => todo.id === action.payload.id)
      if (todoToEdit) {
        // toolkit users immer library so we can mutate our state and immer will make it immutable
        todoToEdit.desc = action.payload.desc;
      }
    }
  }
});