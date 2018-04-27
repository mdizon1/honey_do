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
    <div className="todo-search-wrap">
      <TextField
        className="todo-search"
        label={renderSearchLabel()}
        type="search"
        multiline
        fullWidth={true}
        onChange={props.onChange('searchValue')}
        value={props.value}
      >
      </TextField>
      <i
        className="todo-search-clear-btn fa fa-times"
        onClick={props.onClear}
      ></i>

    </div>
  )
}
export default SearchTodos
