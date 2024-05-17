import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  todos: JSON.parse(localStorage.getItem("todos")) || [
    {
      id: 1,
      text: "Hello World",
      xCoordinate: Math.floor(Math.random() * (window.innerWidth - 400)),
      yCoordinate: Math.floor(Math.random() * (window.innerHeight - 400)),
    },
  ],
  editingTodo: null,
  draggingTodo: null,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const todo = {
        id: nanoid(),
        text: action.payload.text,
        xCoordinate: action.payload.xCoordinate,
        yCoordinate: action.payload.yCoordinate,
      };
      state.todos.push(todo);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      state.todos = state.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text };
        }
        return todo;
      });
    },
    updateTodo: (state, action) => {
      const { id, text, xCoordinate, yCoordinate } = action.payload;
      const todoToUpdate = state.todos.find((todo) => todo.id === id);
      if (todoToUpdate) {
        todoToUpdate.text = text;
        todoToUpdate.xCoordinate = xCoordinate;
        todoToUpdate.yCoordinate = yCoordinate;
      }
    },
    setEditingTodo: (state, action) => {
      state.editingTodo = action.payload;
    },
    resetEditingTodo: (state, action) => {
      state.editingTodo = null;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  editTodo,
  updateTodo,
  setEditingTodo,
  resetEditingTodo,
} = todoSlice.actions;

export default todoSlice.reducer;
