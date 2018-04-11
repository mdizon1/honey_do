import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField/TextField';
import Dialog, { DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog'
import Button from 'material-ui/Button'

const checkForEnterKeypress = (evt, onEnterPressed) => {
  if(evt.keyCode === 13) {
    evt.preventDefault();
    evt.stopPropagation();
    onEnterPressed();
  }
}

const TodoForm = (props) => {

  const { todo, onChange, onClose, onSubmit } = props;

  if(todo) {
    return (
      <div>
        <DialogContent>
          <DialogContentText>
            Use hash tags (#) in the title to tag this item.
          </DialogContentText>
          <div className="form-group">
            <TextField
              label="Title"
              multiline
              autofocus
              fullWidth
              name="title"
              value={todo.title}
              onChange={onChange}
              onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
            />
            <TextField
              label="Notes"
              multiLine
              fullWidth
              name="notes"
              value={todo.notes}
              onChange={onChange}
              onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Save
          </Button>
        </DialogActions>
      </div>
    )

  }else{
    return (
      <div>
        <DialogContent>
          <DialogContentText>
            Use hash tags (#) in the title to tag this item.
          </DialogContentText>
          <div className="form-group">
            <TextField
              label="Title"
              multiline
              fullWidth
              name="title"
              onChange={onChange}
              onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
            />
            <TextField
              label="Notes"
              multiline
              fullWidth
              name="notes"
              onChange={onChange}
              onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Create
          </Button>
        </DialogActions>
      </div>
    )
  }

}

export default TodoForm
