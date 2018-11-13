import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import HoneyDoConfig from "../components/HoneyDoConfig"
import { closeConfig, toggleHideCompleted, clearCompletedRequest } from "../actions/HoneyDoActions"
import Drawer from 'material-ui/Drawer'

const mapStateToProps = (state, ownProps) => {
  return {
    isConfigOpen: state.getIn(['uiState', 'isConfigOpen']),
    uiState: state.get('uiState'),
    permissions: state.getIn(['configState', 'identity', 'permissions'])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleToggleHideCompleted: (evt) => dispatch(toggleHideCompleted()),
    handleCloseConfig: (evt) => dispatch(closeConfig()),
    handleClearCompleted: (evt) => dispatch(clearCompletedRequest())
  };
}

const HoneyDoConfigWrap = (props) => {
  const { isConfigOpen, handleCloseConfig, uiState, permissions, handleToggleHideCompleted, handleClearCompleted} = props;

  return (
    <Drawer
      anchor="left"
      open={isConfigOpen}
      onClose={handleCloseConfig}
    >
      <HoneyDoConfig
        uiProps={uiState}
        permissions={permissions}
        onToggleIsCompletedHidden={handleToggleHideCompleted}
        onClearCompleted={handleClearCompleted}
      />
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(HoneyDoConfigWrap)
