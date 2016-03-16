import React, { PropTypes } from 'react'

const TodoTabs = ({onClickTodoTab, onClickShoppingTab}) => (
  <div className='honey-do-tabs'>
    <ul>
      <li> Todo List </li>
      <li> Shopping List </li>
    </ul>
  </div>
)

TodoTabs.propTypes = {
  onClickTodoTab: PropTypes.func,
  onClickShoppingTab: PropTypes.func
}

export default TodoTabs
