import TodoList from '../components/TodoList'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    todos: state.get('dataState').get('todos').toJS()
  }
}

const VisibleTodoList = connect(
  mapStateToProps
)(TodoList)

export default VisibleTodoList
