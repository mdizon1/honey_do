import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'

import Dialog, { DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import TodoForm from './TodoForm'
import TodoTag from './TodoTag'

const renderTags = (todo, onDestroyTag) => {
  var tags = _.map(todo.tags, (tag) => {
    return (
      <TodoTag 
        key={_.uniqueId('tag_on_edit_todo_')}
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
  const { todo, isFormOpen, onClose, onChange, onSubmit, onDestroyTag } = props;
  var title;

  title = `Editing ${TodoKlassToFriendlyString[todo.klass]} "${todo.title}".`
  return (
    <Dialog
      title={title}
      open={isFormOpen}
      onClose={onClose}
    >
      <DialogTitle>
        Edit this todo
      </DialogTitle>
      { renderTags(todo, onDestroyTag) }
      <TodoForm
        todo={todo}
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

export default EditTodo
