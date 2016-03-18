import { connect } from 'react-redux'
import TodoList from '../components/TodoList'
import { completeTodo } from '../actions/HoneyDoActions'

const mapStateToProps = (state) => {
  return {
    todos: state.get('dataState').get('todos').toJS()
  }
}

// IN PROGRESS: Here is where some magic will happen.. clicking the todo is going to do a bunch of things
const handleTodoClicked = (id, dispatch, ownProps) => {
  console.log("DEBUG: in handleTodoClicked, arguments are =====> ");
  console.log("DEBUG: id --------------> ", id);
  console.log("DEBUG: dispatch --------------> ", dispatch);
  console.log("DEBUG: ownProps --------------> ", ownProps);
  console.log("DEBUG: url for ajax call --------------> ", ownProps.apiEndpoint + '/' +id+ '/accept');
  $.ajax({
    type: "PUT",
    url: ownProps.apiEndpoint + '/' +id+ '/complete',
    data: { authentication_token: ownProps.authToken }
  })
    .done((data, textStatus, jqXHR) => {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // LEFT OFF 
      //   Closing up the loop for checking off a todo, there are several 
      //   steps still in process, see workflowy for more detailed notes
      //   and consolidate with the notes found here
      //
      //   The api call here is hitting the right server endpoint.  The server 
      //   needs to handle this payload appropriately.  Currently it's doing
      //   a permission check which is not quite what I want.  Maybe the endpoint
      //   itself needs to change... it's doing households/todos which is just the
      //   todos controller, I should rethink this and map out a nicer api.
      //   something that exposes and requires the most minimal information
      //   necessary.
      //  
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // TODO: do a sync here to grab the updated todos from the server
      // NOTE: Now that it's come up I'm thinking of the best way to do this
      //   and I'm getting a feel for the way it should look.
      //   here are some ideas:
      //   client sends the todo data back to server
      //   server compares this to what it has and does a diff
      //   send the client instructions on how to update it's own data.
      //   Typically, nothing will be different if the client handled it's own
      //   end correctly (ideally it should).  In the case of things happpening
      //   upstream (another user updates some todos) then it'll do the 
      //   appropriate update on the client.
      //   if there is some error or some uncomputable problem, then it'll
      //   send the whole data set and the client will just stuff that in
      //
      //   another option: client just sends up the data which has changed
      //   since the last sync operation happened.  Server verifies that this
      //   is correct
    })
    .fail((jqXHR, textStatus, errorThrown) => {
    })
    .always(() => { dispatch(completeTodo(id)) });
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onTodoClicked: (id) => { handleTodoClicked(id, dispatch, ownProps); }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
