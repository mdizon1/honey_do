import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { deleteTodoTagRequest, updateTodoRequest } from './../actions/HoneyDoActions';
import EditTodo from '../components/EditTodo'
import { TodoTypeToKlass } from '../constants/TodoTypes'

const mapStateToProps = (state, ownProps) => {
  let editing = state.getIn(['uiState', 'isEditing']);
  if(editing) { editing = editing.toJS(); }

  return {
    todo: editing ? editing.todo : null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (todo) => dispatch(updateTodoRequest(todo)),
    onDestroyTag: (todo, tag) => dispatch(deleteTodoTagRequest(todo, tag))
  }
}

class EditTodoWrap extends Component {
  constructor(props){
    super(props);
    this.state = {
      todo: this.props.todo
    }
  }

  handleDestroyTag(todo, tag){
    let own_todo = this.state.todo;
    let new_tags = _.without(todo.tags, tag);
    own_todo.tags = new_tags;

    this.setState({todo: own_todo});
    this.props.onDestroyTag(todo, tag);
  }

  handleChange(evt) {
    var curr_val, field_name, field_value, todo;

    todo = this.state.todo;

    field_name = evt.target.name;
    field_value = evt.target.value;
    todo[field_name] = field_value;

    this.setState({todo: todo})
  }

  handleSubmit(evt) {
    this.props.onSubmit(this.state.todo);
    this.props.onClose();
  }

  render() {
    const {onClose, onSubmit, onDestroyTag} = this.props;
    var todo = this.state.todo;

    return (
      <EditTodo
        todo={todo}
        onChange={this.handleChange.bind(this)}
        onClose={onClose}
        onSubmit={this.handleSubmit.bind(this)}
        onDestroyTag={this.handleDestroyTag.bind(this)}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTodoWrap)
