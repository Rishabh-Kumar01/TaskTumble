import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  editTodo,
  resetEditingTodo,
} from "../reduxConfig/reducers/todoSlice";

function AddTodo() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const editingTodo = useSelector((state) => {
    console.log("ggggggggggg");
    return state.editingTodo;
  });

  const addTodoHandler = (e) => {
    e.preventDefault();
    const xCoordinate = Math.floor(Math.random() * (window.innerWidth - 250));
    const yCoordinate = Math.floor(Math.random() * (window.innerHeight - 250));
    console.log("yyyyyyyyyyyyy");
    if (editingTodo) {
      dispatch(editTodo({ id: editingTodo.id, text: input }));
      dispatch(resetEditingTodo());
    } else {
      dispatch(addTodo({ text: input, xCoordinate, yCoordinate }));
    }
    setInput("");
  };

  useEffect(() => {
    if (editingTodo) {
      setInput(editingTodo?.text);
    }
  }, [editingTodo]);

  return (
    <form onSubmit={addTodoHandler} className="space-x-3 mt-12">
      <input
        type="text"
        className="bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="Enter a Todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        {editingTodo ? "Click to Update" : "Add Todo"}
      </button>
    </form>
  );
}

export default AddTodo;
