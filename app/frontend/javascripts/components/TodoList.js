import React, { PropTypes } from 'react'
// import Todo from '.Todo'

const TodoList = ({todos}) => (
  <div className='honey-do-todo-list'>
    <ul>
      <li> todo 1 </li>
      <li> todo 2 </li>
    </ul>
  </div>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired
  }).isRequired)
}

export default TodoList
