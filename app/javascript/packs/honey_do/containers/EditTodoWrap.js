import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { editTodoCanceled, editTodoSuccess, editTodoFailure, deleteTodoTagRequest, updateTodoRequest } from './../actions/HoneyDoActions';
import EditTodo from '../components/EditTodo'
import { TodoTypeToKlass } from '../constants/TodoTypes'


const mapStateToProps = (state, ownProps) => {
  let editing = state.getIn(['uiState', 'isEditing']);
  if(editing) { editing = editing.toJS(); }

  return {
    todo: editing ? editing.todo : null,
    appConfig: state.get('configState').toJS(),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClose: () => dispatch(editTodoCanceled()),
    onSubmit: (todo) => dispatch(updateTodoRequest(todo)),
    onDestroyTag: (todo, tag) => dispatch(deleteTodoTagRequest(todo, tag))
  }
}

const buildBlankTodo = () => {
  return {
    title: '',
    notes: '',
    klass: ''
  }
}

class EditTodoWrap extends Component {
  constructor(props){
    super(props);
    this.state = {
      todo: this.props.todo || buildBlankTodo()
    }
  }

  handleDestroyTag(tag){
    let todo = this.state.todo;
    let new_tags = _.without(todo.tags, tag);
    todo.tags = new_tags;

    this.setState({todo: todo});
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

  render() {
    const {open, onClose, onSubmit} = this.props;
    var todo = this.props.todo;

    return (
      <EditTodo
        todo={todo}
        isOpen={open}
        onChange={this.handleChange.bind(this)}
        onClose={onClose}
        onSubmit={() => onSubmit(this.state.todo)}
        onDestroyTag={this.handleDestroyTag.bind(this)}
      />
    )
  }

  //private
  _formatTitle(title){
    return _.trim(title.replace(/#.*/g, ''));
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTodoWrap)
