import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/lib/checkbox'
import IconButton from 'material-ui/lib/icon-button'
import FontIcon from 'material-ui/lib/font-icon'
import MenuItem from 'material-ui/lib/menus/menu-item'


const _renderControls = (isExpanded, onToggleExpand) => {
  return (
    <div className="todo-item-controls">
      <IconButton 
        tooltip="Expand notes"
        onClick={onToggleExpand}
      >
        <FontIcon>
          { isExpanded ? (<i className='fa fa-chevron-up'></i>)
            : (<i className='fa fa-chevron-down'></i>)
          }
        </FontIcon>
      </IconButton>
    </div>
  )
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

const _renderTitle = (todo) => {
  return (
    <div className='todo-item-title'>
      <h4> { todo.title } </h4>
    </div>
  )
}

const TodoItemSingleAction = (props) => {

  const {todo, isExpanded, onTodoClicked, onToggleExpand, connectDragSource} = props;

  return (
    <div className="todo-item">
      <div className="row">
        <div className="col-xs-1">
          <div className="todo-item-checkbox">
            <Checkbox
              checked={todo.isCompleted}
              onCheck={() => onTodoClicked(todo)}
              disabled={todo.isCompleted && !todo.permissions.canUncomplete}
            />
          </div>
        </div>
        <div className="col-xs-1">
          { _renderDragHandle(connectDragSource) }
        </div>
        <div className="col-xs-8">
          <div className="todo-item-content">
            { _renderTitle(todo) }
            { _renderNotes(todo, isExpanded) }
          </div>
        </div>
        <div className="col-xs-2">
          { _renderControls(isExpanded, onToggleExpand) }
        </div>
      </div>
    </div>
  )
}

export default TodoItemSingleAction
