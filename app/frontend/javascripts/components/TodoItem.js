import React, { PropTypes } from 'react'
import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';

function renderCheckbox(todo, handleClick){
  return (
    <Checkbox onCheck={() => handleClick(todo.id)}/>
  )
}

const TodoItem = ({todo, onTodoClicked}) => (
  <ListItem
    primaryText={todo.title}
    secondaryText={todo.notes}
    leftCheckbox={renderCheckbox(todo, onTodoClicked)}
  />
)

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  onTodoClicked: PropTypes.func.isRequired
}

export default TodoItem
