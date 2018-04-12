import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dialog, { DialogTitle } from 'material-ui/Dialog'

import { editTodoCanceled } from './../actions/HoneyDoActions';
import EditTodoWrap from './EditTodoWrap'

const mapStateToProps = (state, ownProps) => {
  var isEditing, editingTodo;

  isEditing = state.getIn(['uiState', 'isEditing']);
  if(isEditing) { 
    editingTodo = isEditing.toJS().todo; 
    isEditing = !!isEditing;
  }

  return {
    todo: isEditing ? editingTodo : null,
//    appConfig: state.get('configState').toJS(),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClose: () => dispatch(editTodoCanceled())
  }
}

const _renderEditTodo = (todo, handleClose) => {
  if(!todo) { return null; }
  return (
    <EditTodoWrap todo={todo} onClose={handleClose} />
  )
}

const EditTodoDialogWrap = (props) => {
  const { todo, handleClose } = props;
//  var { todo } = props;

  return (
    <Dialog
      title=''
      open={!!todo}
      onClose={handleClose}
    >
      <DialogTitle>
        Edit this Todo
      </DialogTitle>
      { _renderEditTodo(todo, handleClose) }
    </Dialog>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTodoDialogWrap)
