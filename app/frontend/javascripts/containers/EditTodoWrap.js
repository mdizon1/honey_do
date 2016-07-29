import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { editTodoCanceled, editTodoSuccess, editTodoFailure } from './../actions/HoneyDoActions';
import EditTodo from '../components/EditTodo'
import { apiUpdateTodo } from '../util/Api'
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

  handleChange(evt) {
    var curr_val, field_name, field_value, todo;

    todo = this.state.todo;

//    switch(evt.target.name){
//      case 'title':
//        console.log("DEBUG: the title field changed... ")
//        todo.title = this._formatTitle(evt.target.value);
//        break;
//      default:
//        field_name = evt.target.name;
//        field_value = evt.target.value;
//        todo[field_name] = field_value;
//    }
    field_name = evt.target.name;
    field_value = evt.target.value;
    todo[field_name] = field_value;

//    console.log(`DEBUG: handleChange, field_name: ${field_name}, field_value: ${field_value}`);
    this.setState({todo: todo})
  }

  handleClose() {
    this.props.dispatch(editTodoCanceled());
  }

  handleSubmit() {
    var todo = this.state.todo;

    apiUpdateTodo({
      endpoint: this.props.appConfig.apiEndpoint,
      authToken: this.props.appConfig.identity.authToken, 
      todo: todo,
      onSuccess: (data, textStatus, jqXHR) => {
        this.props.onSync();
      },
      onFailure: (jqXHR, textStatus, errorThrown) => {
        this.props.onSync();
      },
      onComplete: () => {
        this.handleClose();
      }
    });
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
      />
    )
  }

  //private
  _formatTitle(title){
    return _.trim(title.replace(/#.*/g, ''));
  }
}

export default connect(mapStateToProps)(EditTodoWrap)
