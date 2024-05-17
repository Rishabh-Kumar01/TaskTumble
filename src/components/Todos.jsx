import React, {
  createRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTodo } from "../reduxConfig/reducers/todoSlice";
import RemoveTodo from "./RemoveTodo";
import EditTodo from "./EditTodo";

function Todos() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const noteRefs = useRef({});
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(null);
  const [initialPosition, setInitialPosition] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [mouseUp, setMouseUp] = useState(false); // New state to track mouse up event

  const handleMouseDown = useCallback((todo, e) => {
    setMouseUp(false); // Set mouseUp to false when mouse button is pressed
    const noteRef = noteRefs.current[todo.id];
    if (noteRef.current) {
      const rect = noteRef.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      setOffsetX(e.clientX - rect.left + bodyRect.left);
      setOffsetY(e.clientY - rect.top + bodyRect.top);
      setDragging(todo.id);
      setInitialPosition({
        left: rect.left,
        top: rect.top,
        bottom: rect.bottom,
        right: rect.right,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging && !mouseUp) {
        // Ignore mousemove event if mouseUp is true
        const noteRef = noteRefs.current[dragging].current;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        noteRef.style.left = `${newX}px`;
        noteRef.style.top = `${newY}px`;
      }
    },
    [dragging, offsetX, offsetY, mouseUp]
  );

  const handleMouseUp = useCallback(() => {
    setMouseUp(true); // Set mouseUp to true when mouse button is released
    if (dragging) {
      const noteRef = noteRefs.current[dragging].current;
      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = {
        left: finalRect.left,
        top: finalRect.top,
        bottom: finalRect.bottom,
        right: finalRect.right,
      };

      if (checkForOverlap(dragging, newPosition)) {
        noteRef.style.left = `${initialPosition.left}px`;
        noteRef.style.top = `${initialPosition.top}px`;
      } else {
        dispatch(
          updateTodo({
            ...todos.find((todo) => todo.id === dragging),
            xCoordinate: newPosition.left,
            yCoordinate: newPosition.top,
          })
        );
      }

      setDragging(null);
    }
  }, [dragging, initialPosition, todos, dispatch]);

  const checkForOverlap = useCallback(
    (currentTodoId, newPosition) => {
      const currentTodoRef = noteRefs.current[currentTodoId].current;
      const currentRect = currentTodoRef.getBoundingClientRect();

      return todos.some((todo) => {
        if (todo.id === currentTodoId) return false;

        const otherTodoRef = noteRefs.current[todo.id].current;
        const otherRect = otherTodoRef.getBoundingClientRect();

        const overLap = !(
          newPosition.right < otherRect.left ||
          newPosition.left > otherRect.right ||
          newPosition.top > otherRect.bottom ||
          newPosition.bottom < otherRect.top
        );

        return overLap;
      });
    },
    [todos]
  );

  // New effect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (dragging) {
        const noteRef = noteRefs.current[dragging].current;
        const rect = noteRef.getBoundingClientRect();
        setInitialPosition({
          left: rect.left,
          top: rect.top,
          bottom: rect.bottom,
          right: rect.right,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dragging]); // Added 'dragging' as a dependency

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      <div>Todos</div>
      <ul className="list-none">
        {todos.map((todo) => {
          // Create the ref here
          if (!noteRefs.current[todo.id]) {
            noteRefs.current[todo.id] = createRef();
          }

          return (
            <li
              ref={noteRefs.current[todo.id]}
              onMouseDown={(e) => handleMouseDown(todo, e)}
              className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
              key={todo.id}
              style={{
                left: `${todo.xCoordinate}px`,
                top: `${todo.yCoordinate}px`,
                position: "absolute",
                width: "400px",
                cursor: "move",
                userSelect: "none",
              }}
            >
              <div className="text-white">{todo.text}</div>
              <div>
                <EditTodo todo={todo} />
                <RemoveTodo todo={todo} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Todos;
