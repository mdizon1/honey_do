import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => ( {isActive: state.getIn(['uiState', 'isSpinning'])} );


const HoneyDoSpinner = (props) => {
  if(!props.isSpinning) { return null; }
  console.log("DEBUG: Pow right in the spinna");
  return (
    <div className="honey-do-spinner">
      <CircularProgress />
    </div>
  )
}


export default connect(mapStateToProps)(HoneyDoSpinner)
