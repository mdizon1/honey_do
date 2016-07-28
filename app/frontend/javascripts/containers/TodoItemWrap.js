import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import TodoItemSingleAction from '../components/TodoItemSingleAction'

export default class TodoItemWrap extends Component {
  constructor(props){
    super(props);
    this.state = { isExpanded: false }
  }

  handleToggleExpand(evt){
    this.setState({isExpanded: !this.state.isExpanded});
  }

  render() {
    return (
      <TodoItemSingleAction
        todo={this.props.todo}
        onTodoClicked={this.props.onTodoClicked}
        isExpanded={this.state.isExpanded}
        onToggleExpand={this.handleToggleExpand.bind(this)}
        connectDragSource={this.props.connectDragSource}
      />
    )
  }
}
