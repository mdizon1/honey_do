import React, { Component, PropTypes } from 'react'
import NewTodo from '../components/NewTodo'
import { createTodoRequest, createTodoSuccess, createTodoFailure } from './../actions/HoneyDoActions';
import { TodoTypeToKlass } from '../constants/TodoTypes'

export default class NewTodoWrap extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFormOpen: false,
      form_values: {}
    }
  }

  handleChange(evt) {
    var curr_val, field_name, field_value;

    field_name = evt.target.name;
    field_value = evt.target.value;
    curr_val = this.state.form_values;
    curr_val[field_name] = field_value;
    this.setState({form_values: curr_val})
  }

  handleClose() {
    this.setState({isFormOpen: false});
  }

  handleOpen() {
    this.setState({isFormOpen: true});
  }

  handleSubmit() {
    var dispatch, params;

    dispatch = this.props.store.dispatch;
    params = this.state.form_values;
    params.type = TodoTypeToKlass[this.props.todoType];
    dispatch(createTodoRequest(params));
    $.ajax(this.props.appConfig.apiEndpoint, {
      type: "POST",
      data: {
        authentication_token: this.props.appConfig.identity.authToken, 
        todo: params
      }
    }).done((data, textStatus, jqXHR) => {
      this.props.onSync();
    }).fail((jqXHR, textStatus, errorThrown) => {
    }).always(() => {
      this.handleClose();
    });
    
  }

  render() {
    return (
      <NewTodo 
        onOpen={this.handleOpen.bind(this)}
        onClose={this.handleClose.bind(this)}
        onSubmit={this.handleSubmit.bind(this)}
        onValueChange={this.handleChange.bind(this)}
        isFormOpen={this.state.isFormOpen}
        todoType={this.props.todoType}
      />
    )
  }
}
