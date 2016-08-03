import React, { PropTypes } from 'react'
import TextField from 'material-ui/TextField/TextField';

const TodoForm = (props) => {

  const { todo, onChange, onSubmit } = props;

  if(todo) {
    return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <TextField
            floatingLabelText="Title"
            fullWidth={true}
            onChange={onChange}
            name="title"
            value={todo.title}
          />
          <TextField
            floatingLabelText="Notes"
            multiLine={true}
            fullWidth={true}
            onChange={onChange}
            name="notes"
            value={todo.notes}
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
            onChange={onChange}
            name="title"
          />
          <TextField
            floatingLabelText="Notes"
            multiLine={true}
            fullWidth={true}
            onChange={onChange}
            name="notes"
          />
        </div>
      </form>
    )
  }

}

export default TodoForm
