import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NewTodo from '../components/NewTodo'
import { openCreateForm, closeCreateForm, createTodoRequest, createTodoSuccess, createTodoFailure } from './../actions/HoneyDoActions'
import { TodoTypeToKlass } from '../constants/TodoTypes'

const mapStateToProps = (state, ownProps) => {
  return {
    isFormOpen: state.getIn(['uiState', 'isCreating']),
    form_values: {}
  }
}

class NewTodoWrap extends Component {
  constructor(props){
    super(props);
    this.state = {
      form_values: {}
    }
  }

  handleChange = (evt) => {
    var curr_val, field_name, field_value;

    field_name = evt.target.name;
    field_value = evt.target.value;
    curr_val = this.state.form_values;
    curr_val[field_name] = field_value;
    this.setState({form_values: curr_val})
  }

  handleClose = (evt) => {
    this.props.store.dispatch(closeCreateForm());
    this.setState({form_values: {}});
  }

  handleOpen = (evt) => {
    this.props.store.dispatch(openCreateForm());
  }

  handleSubmit = (evt) => {
    var self, params;

    self = this;
    params = this.state.form_values;
    params.type = TodoTypeToKlass[this.props.todoType];

    this.props.store.dispatch(createTodoRequest(params));
    this.setState({form_values: {}});
  }

  render() {
    return (
      <NewTodo
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        onValueChange={this.handleChange}
        isFormOpen={this.props.isFormOpen}
        todoType={this.props.todoType}
      />
    )
  }
}

export default connect(mapStateToProps)(NewTodoWrap)
