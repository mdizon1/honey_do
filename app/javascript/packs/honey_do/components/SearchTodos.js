import React from 'react'
import TextField from 'material-ui/TextField'

const renderSearchLabel = () => {
  return (
    <div>
      <i className="search-icon fa fa-search"></i>
      Search
    </div>
  )
}

const SearchTodos = (props) => {
  return (
    <TextField
      className="todo-search"
      floatingLabelText={renderSearchLabel()}
      floatingLabelStyle={{paddingLeft: "10px"}}
      fullWidth={true}
      onChange={props.onChange}
      value={props.value}
    >
    </TextField>
  )
}
export default SearchTodos
