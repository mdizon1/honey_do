import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'

import Dialog, { DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import TodoForm from './TodoForm'
import TodoTag from './TodoTag'

const _renderTags = (todo, onDestroyTag) => {
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

const _renderEmptyForm = (props) => {
  return (
    <Dialog
      title=''
      open={props.isOpen}
      onClose={props.onClose}
    >
      <DialogTitle>
        Edit this todo
      </DialogTitle>
      <TodoForm
        todo={null}
        onChange={props.onChange}
        onClose={props.onClose}
        onSubmit={props.onSubmit}
      />
    </Dialog>
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

  var title = '';

  if(!todo){ return _renderEmptyForm(props); }

  title = `Editing ${TodoKlassToFriendlyString[todo.klass]} "${todo.title}".`;
  return (
    <Dialog
      title={title}
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        Edit this todo
      </DialogTitle>
      { _renderTags(todo, onDestroyTag) }
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
