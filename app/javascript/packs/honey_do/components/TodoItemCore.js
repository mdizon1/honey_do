import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import Chip from 'material-ui/Chip/Chip'
import IconMenu from 'material-ui/IconMenu/IconMenu'
import IconButton from 'material-ui/IconButton/IconButton'
import FontIcon from 'material-ui/FontIcon/FontIcon'
import MenuItem from 'material-ui/MenuItem/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const _renderControls = (props) => {
  const {todo, isExpanded, onToggleExpand, onTodoEdit, onTodoAccepted, onTodoDestroyed} = props;
  
  if(todo.permissions.canEdit || 
     todo.permissions.canAccept ||
     todo.permissions.canDestroy){
    // render the popout menu for more controls
    return (
      <div className="todo-item-controls">
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          { _renderMenuItemEdit(todo, onTodoEdit) }
          { _renderMenuItemAccept(todo, onTodoAccepted) }
          { _renderMenuItemDestroy(todo, onTodoDestroyed) }
          { _renderMenuItemToggleExpand(isExpanded, onToggleExpand) }
        </IconMenu>
      </div>
    );
  }else{
    // Only render the caret to expand/close todo notes
    return (
      <div className="todo-item-controls">
        <IconButton 
          tooltip="Expand/collapse notes"
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
}

const _renderDragHandle = (connectDragSource) => { 
  return connectDragSource(
    <div className="todo-item-drag-handle">
      <i className="fa fa-arrows-v"></i>
    </div>
  );
}

const _renderEditIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-pencil-square-o"></i>
  )
}

const _renderMenuItemAccept = (todo, onTodoAccepted) => {
  if(!todo.permissions.canAccept){ return null; }
  return (
    <MenuItem onClick={onTodoAccepted} primaryText="Accept" />
  )
}

const _renderMenuItemDestroy = (todo, onTodoDestroyed) => {
  if(!todo.permissions.canDestroy){ return null; }
  return (
    <MenuItem leftIcon={_renderTrashIcon()} onClick={onTodoDestroyed} primaryText="Destroy" />
  )
}

const _renderMenuItemEdit = (todo, onTodoEdit) => {
  if(!todo.permissions.canEdit){ return null; }
  return ( 
    <MenuItem leftIcon={_renderEditIcon()} onClick={onTodoEdit} primaryText="Edit" />
  )
}

const _renderMenuItemToggleExpand = (isExpanded, onToggleExpand) => {
  return ( 
    <MenuItem 
      leftIcon={_renderTextFileIcon()}
      onClick={onToggleExpand}
      primaryText={isExpanded ? "Collapse notes" : "Expand notes"}
    />
  )
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

const _renderTag = (tag, todo, onTodoTagDestroyed) => {
  return (
    <Chip
      style={{margin: "0 0.25em 0 0"}}
      key={_.uniqueId()}
    >
      { tag }
    </Chip>
  )
}

const _renderTags = (todo, onTodoTagDestroyed) => {
  var tags = _.map(todo.tags, (tag) => {
    return _renderTag(tag, todo, onTodoTagDestroyed);
  });

  return (
    <div className='todo-item-tags'>
      { tags }
    </div>
  )
}

const _renderTextFileIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-file-text-o"></i>
  )
}

const _renderTitle = (todo) => {
  return (
    <div className='todo-item-title'>
      <h4> { todo.title } </h4>
    </div>
  )
}

const _renderTrashIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-trash"></i>
  )
}

const TodoItemCore = (props) => {

  const {todo, isExpanded, onTodoClicked, onTodoTagDestroyed, onToggleExpand, connectDragSource} = props;

  return (
    <div className="todo-item">
      <div className="row">
        <div className="col-2">
          <div className={"todo-item-checkbox" + (todo.isCompleted ? ' checkbox-checked' : '')}>
            <Checkbox
              checked={todo.isCompleted}
              onCheck={() => onTodoClicked(todo)}
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
