import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import HoneyDoConfig from "../components/HoneyDoConfig"
import { closeConfig, toggleHideCompleted } from "../actions/HoneyDoActions"
import Drawer from 'material-ui/Drawer'

const mapStateToProps = (state, ownProps) => {
  return {
    isConfigOpen: state.getIn(['uiState', 'isConfigOpen']),
    uiState: state.get('uiState')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleToggleHideCompleted: (evt) => dispatch(toggleHideCompleted()),
    handleCloseConfig: (evt) => dispatch(closeConfig())
  };
}

const HoneyDoConfigWrap = (props) => {
  const { isConfigOpen, handleCloseConfig, uiState, handleToggleHideCompleted } = props;

  return (
    <Drawer
      anchor="left"
      open={isConfigOpen}
      onClose={handleCloseConfig}
    >
      <HoneyDoConfig
        uiProps={uiState}
        onToggleIsCompletedHidden={handleToggleHideCompleted}
      />
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(HoneyDoConfigWrap)
