import React, { PropTypes } from 'react'
import { TodoKlassToFriendlyString } from '../constants/TodoTypes'
import TodoForm from './TodoForm'

import Chip from 'material-ui/Chip/Chip'
import Dialog from 'material-ui/Dialog/Dialog'
import Button from 'material-ui/Button'

const renderTag = (todo, tag, onDestroyTag) => {
  return (
    <Chip
      onRequestDelete={((evt) => onDestroyTag(tag))}
      key={_.uniqueId('tag_on_edit_todo_')}
      style={{margin: "0 0.25em 0 0"}}
    >
      { tag }
    </Chip>
  )
}

const renderTags = (todo, onDestroyTag) => {
  var tags = _.map(todo.tags, (tag) => {
    return renderTag(todo, tag, onDestroyTag) 
  });

  return (
    <div className='edit-todo-tag-list'>
      { tags }
    </div>
  )
}

const EditTodo = (props) => {
  const { todo, isFormOpen, onClose, onChange, onSubmit, onDestroyTag } = props;
  var actions = [
    <Button
      label="Cancel"
      secondary={true}
      onMouseUp={onClose}
    />,
    <Button
      label="Submit"
      primary={true}
      onMouseUp={onSubmit}
    />,
  ];
  return (
    <Dialog
      title={`Editing ${TodoKlassToFriendlyString[todo.klass]} "${todo.title}".`}
      actions={actions}
      modal={false}
      open={isFormOpen}
      onRequestClose={onClose}
      autoScrollBodyContent={true}
    >
      { renderTags(todo, onDestroyTag) }
      <TodoForm
        todo={todo}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

export default EditTodo
