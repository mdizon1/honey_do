import React, { Component, PropTypes } from 'react'
import { UiTabs } from './../actions/HoneyDoActions'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import FlatButton from 'material-ui/lib/flat-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Dialog from 'material-ui/lib/dialog';

const friendlyTodoType = (todoType) => {
  if(todoType == UiTabs.SHOPPING_LIST) { return "shopping item";}
  if(todoType == UiTabs.TODOS) { return "todo"; }
}

export default class NewTodo extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFormOpen: false
    }
  }

  handleOpen() {
    this.setState({isFormOpen: true});
  }

  handleClose() {
    this.setState({isFormOpen: false});
  }

  renderDialog() {
    var actions;

    actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchEnd={this.handleClose.bind(this)}
        onMouseUp={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchEnd={this.handleClose.bind(this)}
        onMouseUp={this.handleClose.bind(this)}
      />,
    ];

    return (
      <Dialog
        title={`Create a new ${friendlyTodoType(this.props.todoType)}.`}
        actions={actions}
        modal={false}
        open={this.state.isFormOpen}
        onRequestClose={this.handleClose.bind(this)}
      >
        Form goes here.....
      </Dialog>
    )
  }

  renderNewTodoButton() {
    return (
      <FloatingActionButton 
        className="new-todo-button"
        onMouseUp={this.handleOpen.bind(this)}
        onTouchEnd={this.handleOpen.bind(this)}
      >
        <ContentAdd />
      </FloatingActionButton>
    )
  }
  
  render() {
    return (
      <div>
        {this.renderNewTodoButton()}
        {this.renderDialog()}
      </div>
    );
  }
}
