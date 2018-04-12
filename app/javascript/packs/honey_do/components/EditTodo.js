import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'

import Button from 'material-ui/Button'
import TodoForm from './TodoForm'
import TodoTag from './TodoTag'

const _renderTags = (todo, onDestroyTag) => {
  var tags = _.map(todo.tags, (tag) => {
    return (
      <TodoTag
        key={_.uniqueId('tag_on_edit_todo_')}
        todo={todo}
        tag={tag}
        onDelete={onDestroyTag}
      />
    )
  });

  return (
    <div className='edit-todo-tag-list'>
      { tags }
    </div>
  )
}

const EditTodo = (props) => {
  const {
    todo,
    isOpen,
    onClose,
    onChange,
    onSubmit,
    onDestroyTag
  } = props;

  let title = `Editing ${TodoKlassToFriendlyString[todo.klass]} "${todo.title}".`;

  return (
    <div className="edit-todo-dialog-content">
      { _renderTags(todo, onDestroyTag) }
      <TodoForm
        todo={todo}
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default EditTodo
