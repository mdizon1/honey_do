import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import HoneyDoConfig from "../components/HoneyDoConfig"
import { closeConfig, toggleHideCompleted, clearCompletedRequest, clearCompletedConfirm, clearCompletedConfirmCanceled } from "../actions/HoneyDoActions"
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
    handleClearCompleted: (evt) => dispatch(clearCompletedRequest()),
    handleClearCompletedRequest: (evt) => dispatch(clearCompletedConfirm()),
    handleClearCompletedRequestCanceled: (evt) => dispatch(clearCompletedConfirmCanceled())
  };
}

const HoneyDoConfigWrap = (props) => {
  const { isConfigOpen, handleCloseConfig, uiState, permissions, handleToggleHideCompleted, handleClearCompleted, handleClearCompletedRequest, handleClearCompletedRequestCanceled} = props;

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
        onRequestClearCompleted={handleClearCompletedRequest}
        onRequestClearCompletedCancelled={handleClearCompletedRequestCanceled}
      />
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(HoneyDoConfigWrap)
