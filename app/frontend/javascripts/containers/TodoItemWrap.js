import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import TodoItemCore from '../components/TodoItemCore'
import { editTodoRequest} from '../actions/HoneyDoActions'
import { apiRemoveTag } from '../util/Api'

const mapStateToProps = (state, ownProps) => {
  return { 
    appConfig: state.get('configState').toJS(),
  }
}

class TodoItemWrap extends Component {
  constructor(props){
    super(props);
    this.state = { isExpanded: false, todo: props.todo }
  }

  handleToggleExpand(evt){
    this.setState({isExpanded: !this.state.isExpanded});
  }

  handleTodoEdit(evt){
    this.props.dispatch(editTodoRequest(this.props.todo));
  }

  render() {
    return (
      <TodoItemCore
        todo={this.state.todo}
        connectDragSource={this.props.connectDragSource}
        isExpanded={this.state.isExpanded}
        onTodoClicked={this.props.onTodoClicked}
        onToggleExpand={this.handleToggleExpand.bind(this)}
        onTodoEdit={this.handleTodoEdit.bind(this)}
        onTodoDestroyed={this.props.onTodoDestroyed}
        onTodoAccepted={this.props.onTodoAccepted}
      />
    )
  }
}

export default connect(mapStateToProps)(TodoItemWrap)
