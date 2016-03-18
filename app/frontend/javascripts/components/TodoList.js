import React, { PropTypes } from 'react'
import List from 'material-ui/lib/lists/list';
import TodoItem from './TodoItem'

// const TodoList = ({todos}) => (
//   <div className='honey-do-todo-list'>
//     <ul>
//       {todos.map(todo => 
//         <li key={"todo_item_" + todo.id}>
//           <TodoItem 
//             key={"todo_" + todo.id}
//             todo={todo}
//           />
//         </li>
//       )}
//     </ul>
//   </div>
// )
//

function renderTodo(todo, handleClick){
  console.log("DEBUG: rendering a single todo...");
  return (
    <li key={"todo_item_" + todo.id}>
      <TodoItem 
        key={"todo_"+todo.id}
        todo={todo}
        onTodoClicked={handleClick}
      />
    </li>
  )
}

const TodoList = function ({todos, onTodoClicked}) {
  return (
    <List className='honey-do-todo-list'>
      <ul>
        {todos.map(function (todo){ return renderTodo(todo, onTodoClicked) })}
      </ul>
    </List>
  )
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    isCompleted: PropTypes.bool,
    title: PropTypes.string,
    notes: PropTypes.string
  }).isRequired),
  onTodoClicked: PropTypes.func.isRequired
}

export default TodoList
