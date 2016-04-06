import React, { Component, PropTypes } from 'react'
import List from 'material-ui/lib/lists/list'
import TodoItem from './TodoItem'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { completeTodoRequest, completeTodoSuccess, completeTodoFailure,
  todoReorderRequest, todoReorderSuccess, todoReorderFailure,
  uncompleteTodoRequest, uncompleteTodoSuccess, uncompleteTodoFailure 
  } from '../actions/HoneyDoActions'


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
  dispatch(uncompleteTodoRequest(id));
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

const getTodosFromStore = (store) => {
  let todos =  store.getState().getIn(["dataState","todos"]).toJS();
  todos = Object.keys(todos).map(key => todos[key]); // convert todos into array
  todos = _.sortBy(todos, (val) => { return val.position });
  _.forEach(todos, (curr, index) => { curr.index = index; });
  
  return todos;
}

class TodoList extends Component {
  componentWillMount() {
    this.setState({
      unsubscribe: this.props.store.subscribe(this.onStateChange.bind(this)),
      todos: getTodosFromStore(this.props.store)
    });
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  handleTodoClicked(id, isChecked){
    var dispatch = this.props.store.dispatch;

    if(isChecked) {
      uncompleteTodo(id, dispatch, this.props)
    }else{
      completeTodo(id, dispatch, this.props)
    }
  }

  handleTodoDropped(droppedId, positionsJumped){
    var self, dispatch;

    self = this;
    dispatch = this.props.store.dispatch;

    let temp_todo = this.props.store.getState().getIn(['dataState', 'todos', droppedId.toString()]).toJS();

    dispatch(todoReorderRequest(this.state.todos));
    $.ajax({
      type: "PUT",
      url: this.props.apiEndpoint + '/' + temp_todo.id + '/reorder',
      data: { 
        authentication_token: this.props.authToken,
        todo: temp_todo,
        positions_jumped: positionsJumped
      }
    })
      .done((data, textStatus, jqXHR) => {
        dispatch(todoReorderSuccess(temp_todo.id, positionsJumped));
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        dispatch(todoReorderFailure(temp_todo.id, jqXHR));
      })
      .always((data_jqXHR, textStatus, jqXHR_errorThrown) => {
        this.props.onSync();
      });
  }

  handleTodoReorder(id, newIndex) {
    let local_todo_state = this.state.todos;
    let todo = _.find(local_todo_state, (curr) => { return curr.id == id; });
    let prev_index = todo.index;

    // change it's index
    todo.index = newIndex;

    // update other indices
    _.forEach(local_todo_state, (curr, index) => {
      if(curr.id == id) { return; }
      // moving down
      if(newIndex >= prev_index) {
        if(curr.index >= newIndex) { return curr.index-=1; }
      }
      // moving up
      if(newIndex <= prev_index) {
        if(curr.index >= newIndex) { return curr.index+=1; }
      }
    });

    // reorder by index

    local_todo_state = _.sortBy(local_todo_state, (curr) => {
      return curr.index;
    });

    // renumber indices
    _.forEach(local_todo_state, (curr, index) => {
      curr.index = index;
    });

    this.setState({todos: local_todo_state});
  }

  onStateChange(){
    let new_todo_state = getTodosFromStore(this.props.store);

    if(!_.isEqual(this.state.todos, new_todo_state)){
      this.setState({ todos: new_todo_state});
    }
  }

  render() {
    var self = this;

    if(!this.state.todos){
      return (
        <List className='honey-do-todo-list'>
          No items...
        </List>
      )
    }

    return (
      <div>
        <List className='honey-do-todo-list'>
          <ul>
            {this.state.todos.map(function (todo){ 
              return (
                <li key={"todo_item_" + todo.id}>
                  <TodoItem 
                    key={"todo_"+todo.id}
                    todo={todo}
                    onTodoClicked={self.handleTodoClicked.bind(self)}
                    onTodoDropped={self.handleTodoDropped.bind(self)}
                    onTodoReorder={self.handleTodoReorder.bind(self)}
                  />
                </li>
              )
            })}
          </ul>
        </List>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(TodoList)
