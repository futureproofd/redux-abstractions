import { v1 as uuid } from "uuid";
import { Todo } from "./type";
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

const CREATE_TODO = 'CREATE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SELECT_TODO = 'SELECT_TODO';

interface CreateTodoActionType {
  type: typeof CREATE_TODO;
  payload: Todo
}

interface EditTodoActionType {
  type: typeof EDIT_TODO;
  payload: { id: string, desc: string }
}

interface ToggleTodoActionType {
  type: typeof TOGGLE_TODO;
  payload: { id: string, isComplete: boolean }
}

interface DeleteTodoActionType {
  type: typeof DELETE_TODO;
  payload: { id: string }
}

interface SelectTodoActionType {
  type: typeof SELECT_TODO;
  payload: { id: string }
}

export const createTodoActionCreator = ({ desc }: {
  desc: string
}): CreateTodoActionType => {
  return {
    type: CREATE_TODO,
    payload: {
      id: uuid(),
      desc,
      isComplete: false
    }
  }
}

export const editTodoActionCreator = ({ id, desc }: {
  id: string,
  desc: string
}): EditTodoActionType => {
  return {
    type: EDIT_TODO,
    payload: {
      id,
      desc
    }
  }
}

export const toggleTodoActionCreator = ({ id, isComplete }: {
  id: string, isComplete: boolean
}): ToggleTodoActionType => {
  return {
    type: TOGGLE_TODO,
    payload: {
      id,
      isComplete
    }
  }
}

export const deleteTodoActionCreator = ({ id }: {
  id: string
}): DeleteTodoActionType => {
  return {
    type: DELETE_TODO,
    payload: { id }
  }
}

export const selectTodoActionCreator = ({ id }: {
  id: string
}): SelectTodoActionType => {
  return {
    type: SELECT_TODO,
    payload: { id }
  }
}

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

type TodoActionTypes = CreateTodoActionType | DeleteTodoActionType | EditTodoActionType | ToggleTodoActionType;
const todosReducer = (state: Todo[] = todosInitialState, action: TodoActionTypes) => {
  switch (action.type) {
    case CREATE_TODO: {
      const { payload } = action;
      return [...state, payload];
    }
    case EDIT_TODO: {
      const { payload } = action;
      return state.map(todo => todo.id === payload.id ? { ...todo, desc: payload.desc } : todo);
    }
    case TOGGLE_TODO: {
      const { payload } = action;
      return state.map(todo => todo.id === payload.id ? { ...todo, isComplete: payload.isComplete } : todo);
    }
    case DELETE_TODO: {
      const { payload } = action;
      return state.filter(todo => todo.id !== payload.id);
    }
    default: {
      return state;
    }
  }
}

type SelectedTodoActionTypes = SelectTodoActionType;
const selectedTodoReducer = (state: string | null = null, action: SelectedTodoActionTypes) => {
  switch (action.type) {
    case SELECT_TODO: {
      const { payload } = action;
      return payload.id;
    }
    default:
      return state;
  }
}

const counterReducer = (state: number = 0, action: TodoActionTypes) => {
  switch (action.type) {
    case CREATE_TODO: {
      return state + 1;
    }
    case EDIT_TODO: {
      return state + 1;
    }
    case TOGGLE_TODO: {
      return state + 1;
    }
    case DELETE_TODO: {
      return state + 1;
    }
    default: {
      return state;
    }
  }
}

// Combine reducers (via redux)
const reducers = combineReducers({
  todos: todosReducer,
  selectedTodo: selectedTodoReducer,
  counter: counterReducer
});

// Store w/o composeWithDevTools (since we normally need to specify devTools to get proper debugging)
//export default createStore(reducers, compose(applyMiddleware(thunk, logger)))

// Store
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk, logger)))
