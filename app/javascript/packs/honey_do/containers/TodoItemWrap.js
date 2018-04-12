import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import TodoItemCore from '../components/TodoItemCore'
import { deleteTodoTagRequest, editTodoRequest} from '../actions/HoneyDoActions'

const mapStateToProps = (state, ownProps) => {
  return {};
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onTodoTagDestroyed: (todo, tag) => dispatch(deleteTodoTagRequest(todo, tag)),
    onTodoEdit: (todo) => dispatch(editTodoRequest(todo))
  }
}

class TodoItemWrap extends Component {
  constructor(props){
    super(props);
    this.state = { isExpanded: false }
  }

  handleToggleExpand(evt){
    this.setState({isExpanded: !this.state.isExpanded});
  }

  render() {
    const {
      todo,
      connectDragSource,
      isExpanded,
      onTodoClicked,
      onTodoDestroyed,
      onTodoAccepted,
      onTodoTagDestroyed,
      onTodoEdit,
    } = this.props;

    return (
      <TodoItemCore
        todo={todo}
        connectDragSource={connectDragSource}
        isExpanded={this.state.isExpanded}
        onTodoClicked={onTodoClicked}
        onToggleExpand={this.handleToggleExpand.bind(this)}
        onTodoEdit={(evt) => onTodoEdit(todo)}
        onTodoDestroyed={onTodoDestroyed}
        onTodoAccepted={onTodoAccepted}
        onTodoTagDestroyed={onTodoTagDestroyed}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoItemWrap)
