import { configureStore, createSlice, getDefaultMiddleware, PayloadAction } from '@reduxjs/toolkit'
import { v1 as uuid } from "uuid";
import { logger } from 'redux-logger';
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

// createSlice will replace our action creators and action types (see redux-og)
// distinguishes our action creators via name (i.e. todos/create)
const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    /* since create needs to use uuid() and create slice is responsible for creating our action creators,
      we need to provide an object instead of a function (to keep our reducers pure):
      1. the prepare function makes a new payload that in turn gets used on our reducer*/
    create: {
      reducer: (state, { payload }: PayloadAction<{ id: string, desc: string, isComplete: boolean }>) => {
        // immer will ensure this returns an immutable object.
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false
        }
      })
    },
    edit: (state, action: PayloadAction<{ id: string, desc: string }>) => {
      const todoToEdit = state.find(todo => todo.id === action.payload.id)
      if (todoToEdit) {
        // toolkit users immer library so we can mutate our state and immer will make it immutable
        todoToEdit.desc = action.payload.desc;
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string, isComplete: boolean }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id)
      if (todoToEdit) {
        todoToEdit.isComplete = payload.isComplete;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(todo => todo.id === payload.id)
      if (index) {
        state.splice(index, 1);
      }
    },
  }
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  // primitive values in state can be returned directly
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
  }
});

// counter slice needs actions that are from other state slices (todo slice)
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  // no reducers of it's own
  reducers: {},
  extraReducers: {
    // key in pair needs to be explicitly set via 'type'
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1,
  }
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator
} = todosSlice.actions;

export const {
  select: selectTodoActionCreator
} = selectedTodoSlice.actions;

// toolkit will automatically call combineReducers on our object of reducers (see redux-og for comparison)
const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer
}

// toolkit's version of createStore (see redux-og for comparison)
// also automatically comes with devtools and thunk

// getDefaultMiddleware (similar to applyMiddleware) allows us spread the default
// middleware that redux-toolkit comes with along with any custom middleware we specify.
const middleware = [...getDefaultMiddleware(), logger]
export default configureStore({ reducer, middleware })