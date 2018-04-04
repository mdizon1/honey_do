import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { editTodoCanceled, editTodoSuccess, editTodoFailure, deleteTodoTagRequest, updateTodoRequest } from './../actions/HoneyDoActions';
import EditTodo from '../components/EditTodo'
import { TodoTypeToKlass } from '../constants/TodoTypes'


const mapStateToProps = (state, ownProps) => {
  let editing = state.getIn(['uiState', 'isEditing']);

  return {
    todo: editing ? editing.todo : null,
    appConfig: state.get('configState').toJS(),
    isFormOpen: !!editing
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
      todo: this.props.todo
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.todo) {
      this.setState({todo: nextProps.todo});
    }
  }

  handleDestroyTag(tag){
    let todo = this.state.todo;
    let new_tags = _.without(todo.tags, tag);
    todo.tags = new_tags;

    this.setState({todo: todo});
    this.props.dispatch(deleteTodoTagRequest(todo, tag));
  }

  handleChange(evt) {
    var curr_val, field_name, field_value, todo;

    todo = this.state.todo;

    field_name = evt.target.name;
    field_value = evt.target.value;
    todo[field_name] = field_value;

    this.setState({todo: todo})
  }

  handleClose() {
    this.props.dispatch(editTodoCanceled());
  }

  handleSubmit() {
    this.props.dispatch(updateTodoRequest(this.state.todo));
  }

  render() {
    var todo = this.state.todo;

    if(!todo) {
      todo = buildBlankTodo();
    }

    return (
      <EditTodo
        todo={todo}
        isFormOpen={this.props.isFormOpen}
        onChange={this.handleChange.bind(this)}
        onClose={this.handleClose.bind(this)}
        onSubmit={this.handleSubmit.bind(this)}
        onDestroyTag={this.handleDestroyTag.bind(this)}
      />
    )
  }

  //private
  _formatTitle(title){
    return _.trim(title.replace(/#.*/g, ''));
  }
}

export default connect(mapStateToProps)(EditTodoWrap)
