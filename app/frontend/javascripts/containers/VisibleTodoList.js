import { connect } from 'react-redux'
import TodoList from '../components/TodoList'
import { completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'

const mapStateToProps = (state) => {
  var todos = state.get('dataState').get('todos').toJS();
  todos = Object.keys(todos).map(key => todos[key]) // convert todos into array
  todos = _.sortBy(todos, (val) => { return val.position })
  return { todos: todos }
}

const completeTodo = (id, dispatch, ownProps) => {
  dispatch(completeTodoRequest(id)) 
  $.ajax({
    type: "PUT",
    url: ownProps.apiEndpoint + '/' +id+ '/complete',
    data: { authentication_token: ownProps.authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(completeTodoSuccess(id, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(completeTodoFailure(id, jqXHR));
    });

}

const uncompleteTodo = (id, dispatch, ownProps) => {
  dispatch(uncompleteTodoRequest(id)) 
  $.ajax({
    type: "PUT",
    url: ownProps.apiEndpoint + '/' +id+ '/uncomplete',
    data: { authentication_token: ownProps.authToken }
  })
    .done((data, textStatus, jqXHR) => {
      dispatch(uncompleteTodoSuccess(id, data));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch(uncompleteTodoFailure(id, jqXHR));
    });
}

const handleTodoClicked = (id, isChecked, dispatch, ownProps) => {
  if(isChecked) {
    uncompleteTodo(id, dispatch, ownProps)
  }else{
    completeTodo(id, dispatch, ownProps)
  }

}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onTodoClicked: (id, isChecked) => { handleTodoClicked(id, isChecked, dispatch, ownProps); }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
