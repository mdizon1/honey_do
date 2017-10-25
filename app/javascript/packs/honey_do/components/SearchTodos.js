import React from 'react'
import TextField from 'material-ui/TextField'
const SearchTodos = (props) => {
  return (
    <TextField 
      hintText="Search" 
      fullWidth={true}
      onChange={props.onChange}
    />
  )
}

export default SearchTodos
