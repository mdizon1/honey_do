import React, { PropTypes } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'

// NOTE: This doesn't work
const styles = theme => ({
  button: {
    position: "fixed",
    "margin-left": "-31px"
  }
})
const NewTodoButton = (props) => {
  const {onClick} = props
  return (
    <Button
      className="new-todo-button primary-floating-button"
      onClick={onClick}
      color="primary"
      variant="fab"
    >
      <i className="fa fa-plus" />
    </Button>
  )
}

export default withStyles(styles)(NewTodoButton)
