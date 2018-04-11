import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import Chip from 'material-ui/Chip/Chip'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton/IconButton'
import Icon from 'material-ui/Icon'
import TodoItemControls from './TodoItemControls'
import TodoTag from './TodoTag'

const _renderControls = (props) => {
  const {
    todo,
    isExpanded,
    onToggleExpand,
    onTodoEdit,
    onTodoAccepted,
    onTodoDestroyed
  } = props;

  if(todo.permissions.canEdit ||
     todo.permissions.canAccept ||
     todo.permissions.canDestroy
  ){
    // render the popout menu for more controls
    return (
      <TodoItemControls
        todo            ={todo}
        isExpanded      ={isExpanded}
        onToggleExpand  ={onToggleExpand}
        onTodoEdit      ={onTodoEdit}
        onTodoAccepted  ={onTodoAccepted}
        onTodoDestroyed ={onTodoDestroyed}
      />
    )
  }else{
    // Only render the caret to expand/close todo notes
    // TODO: This needs to be reworked to work with material ui upgrade, see <TodoItemControls>
    return (
      <div className="todo-item-controls">
        <IconButton
          tooltip="Expand/collapse notes"
          onClick={onToggleExpand}
        >
          <Icon>
            { isExpanded ? (<i className='fa fa-chevron-up'></i>)
              : (<i className='fa fa-chevron-down'></i>)
            }
          </Icon>
        </IconButton>
      </div>
    )
  }
}

const _renderDragHandle = (connectDragSource) => {
  return connectDragSource(
    <div className="todo-item-drag-handle">
      <i className="fa fa-arrows-v"></i>
    </div>
  );
}

const _renderNotes = (todo, isExpanded) => {
  let notes_class;
  notes_class = "todo-item-notes";
  notes_class += (isExpanded ? null : " todo-item-notes-truncated")
  return (
    <div className={notes_class}>
      { todo.notes }
    </div>
  )
}

const _renderTags = (todo, onTodoTagDestroyed) => {
  var tags = _.map(todo.tags, (tag) => {
    return (
      <TodoTag
        key={_.uniqueId('tag_on_todo_')}
        tag={tag}
        todo={todo}
        onDelete={onTodoTagDestroyed}
      />
    )
  });

  return (
    <div className='todo-item-tags'>
      { tags }
    </div>
  )
}

const _renderTitle = (todo) => {
  return (
    <div className='todo-item-title'>
      <h4> { todo.title } </h4>
    </div>
  )
}

const TodoItemCore = (props) => {

  const {
    todo,
    isExpanded,
    onTodoClicked,
    onTodoTagDestroyed,
    onToggleExpand,
    connectDragSource
  } = props;

  return (
    <div className="todo-item">
      <div className="row">
        <div className="col-2">
          <div className={"todo-item-checkbox" + (todo.isCompleted ? ' checkbox-checked' : '')}>
            <Checkbox
              checked={todo.isCompleted}
              onChange={() => onTodoClicked(todo)}
              disabled={todo.isCompleted && !todo.permissions.canUncomplete}
            />
          </div>
          { _renderDragHandle(connectDragSource) }
        </div>
        <div className="col-9">
          <div className={"todo-item-content" + (isExpanded ? " todo-item-content-expanded" : "")}>
            { _renderTitle(todo) }
            { _renderNotes(todo, isExpanded) }
            { _renderTags(todo, onTodoTagDestroyed) }
          </div>
        </div>
        <div className="col-1">
          { _renderControls(props) }
        </div>
      </div>
    </div>
  )
}

export default TodoItemCore
