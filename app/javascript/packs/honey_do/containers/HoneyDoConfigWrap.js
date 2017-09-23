import React, { Component, PropTypes } from 'react'
import HoneyDoConfigTab from "../components/HoneyDoConfigTab"
import { toggleHideCompleted } from "../actions/HoneyDoActions"

export default class HoneyDoConfigWrap extends Component {
  constructor(props){
    super(props);
  }

  handleToggle(){
    this.props.store.dispatch(toggleHideCompleted());
  }

  render(){
    return (
      <HoneyDoConfigTab 
        uiProps={ this.props.store.getState().getIn(["uiState"]).toJS() }
        onToggleIsCompletedHidden={this.handleToggle.bind(this)}
      />
    )
  }
}
