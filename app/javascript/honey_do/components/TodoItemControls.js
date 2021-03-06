import React, { Component } from 'react'
import Menu, { MenuList, MenuItem } from 'material-ui/Menu'
import { ListItemIcon, ListItemText} from 'material-ui/List'
import IconButton from 'material-ui/IconButton/IconButton'
import Icon from 'material-ui/Icon'

export default class TodoItemControls extends Component {
  constructor(props){
    super(props);
    this.state = { anchorEl: null };
  }

  handleOpenMenu = (event) => {
    this.setState({anchorEl: event.currentTarget})
  }

  handleCloseMenu = (evt) => {
    this.setState({anchorEl: null})
  }

  render(){
    const {
      todo,
      isExpanded,
      onToggleExpand,
      onTodoEdit,
      onTodoAccepted,
      onTodoDestroyed
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className="todo-item-controls">
        <IconButton
          aria-label="More"
          onClick={this.handleOpenMenu}
        >
          <Icon>
            <i className='fa fa-ellipsis-h'></i>
          </Icon>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}
        >
          { _renderMenuItemEdit(todo, onTodoEdit, this.handleCloseMenu) }
          { _renderMenuItemAccept(todo, onTodoAccepted, this.handleCloseMenu) }
          { _renderMenuItemDestroy(todo, onTodoDestroyed, this.handleCloseMenu) }
          { _renderMenuItemToggleExpand(isExpanded, onToggleExpand, this.handleCloseMenu) }
        </Menu>
      </div>
    );
  }
}

const _renderThumbUpIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-thumbs-up"></i>
  )
}

const _renderEditIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-pencil-square-o"></i>
  )
}

const _renderTextFileIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-file-text-o"></i>
  )
}

const _renderTrashIcon = () => {
  return (
    <i className="todo-item-controls-icon fa fa-trash"></i>
  )
}

const _renderMenuItemAccept = (todo, onTodoAccepted, afterCallback) => {
  if(!todo.permissions.canAccept){ return null; }
  return (
    <MenuItem onClick={(evt) => {onTodoAccepted(evt); afterCallback()}}>
      <ListItemIcon>
        <Icon>
          { _renderThumbUpIcon() }
        </Icon>
      </ListItemIcon>
      <ListItemText
        primary="Accept"
        inset
      />
    </MenuItem>
  )
}

const _renderMenuItemDestroy = (todo, onTodoDestroyed, afterCallback) => {
  if(!todo.permissions.canDestroy){ return null; }
  return (
    <MenuItem onClick={(evt) => {onTodoDestroyed(evt); afterCallback()}}>
      <ListItemIcon>
        <Icon>
          { _renderTrashIcon() }
        </Icon>
      </ListItemIcon>
      <ListItemText
        primary="Destroy"
        inset
      />
    </MenuItem>
  )
}

const _renderMenuItemEdit = (todo, onTodoEdit, afterCallback) => {
  if(!todo.permissions.canEdit){ return null; }
  return (
    <MenuItem onClick={(evt) => {onTodoEdit(evt); afterCallback()}}>
      <ListItemIcon>
        <Icon>
          { _renderEditIcon() }
        </Icon>
      </ListItemIcon>
      <ListItemText
        primary="Edit"
        inset
      />
    </MenuItem>
  )
}


// TODO: add some accessibility to these icons
const _renderExpandIcon = (isExpanded) => {
  if(isExpanded){
    return (
      <Icon>
        <i className='fa fa-chevron-up'></i>
      </Icon>
    )
  }else{
    return (
      <Icon>
        <i className='fa fa-chevron-down'></i>
      </Icon>
    )
  }
}

const _renderMenuItemToggleExpand = (isExpanded, onToggleExpand, afterCallback) => {
  return (
    <MenuItem onClick={(evt) => {onToggleExpand(evt); afterCallback()}}>
      <ListItemIcon>
        { _renderExpandIcon(isExpanded) }
      </ListItemIcon>
      <ListItemText
        primary={isExpanded ? "Collapse notes" : "Expand notes"}
        inset
      />
    </MenuItem>
  )
}
