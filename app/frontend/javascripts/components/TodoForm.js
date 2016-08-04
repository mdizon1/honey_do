import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField/TextField';

const checkForEnterKeypress = (evt, onEnterPressed) => {
  if(evt.keyCode === 13) {
    evt.preventDefault();
    evt.stopPropagation();
    onEnterPressed();
  }
}

const TodoForm = (props) => {

  const { todo, onChange, onSubmit } = props;

  if(todo) {
    return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <TextField
            floatingLabelText="Title"
            fullWidth={true}
            name="title"
            value={todo.title}
            onChange={onChange}
            onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
          />
          <TextField
            floatingLabelText="Notes"
            multiLine={true}
            fullWidth={true}
            name="notes"
            value={todo.notes}
            onChange={onChange}
            onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
          />
        </div>
      </form>
    )
 
  }else{
    return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <TextField
            floatingLabelText="Title"
            fullWidth={true}
            name="title"
            onChange={onChange}
            onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
          />
          <TextField
            floatingLabelText="Notes"
            multiLine={true}
            fullWidth={true}
            name="notes"
            onChange={onChange}
            onKeyDown={(evt) => checkForEnterKeypress(evt, onSubmit)}
          />
        </div>
      </form>
    )
  }

}

export default TodoForm
