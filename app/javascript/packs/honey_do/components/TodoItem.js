// TODO: hah
// Move me to the containers folder
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants/ItemTypes'
import flow from 'lodash/flow'

import TodoItemDragPlaceholder from './TodoItemDragPlaceholder'
import TodoItemWrap from '../containers/TodoItemWrap'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import IconButton from 'material-ui/IconButton/IconButton'
import Icon from 'material-ui/Icon/Icon'


// This whole mess up here is just to try and optimize data loading for this
// component's props such that these things don't rerender unless they have
// to.  Especially with respect to drag and drop, which is a huge performance
// pitfall
const todoSelector = (state, props) => state.getIn(['dataState', 'todos', props.todoId.toString()]);
const todoObjectSelector = createSelector([todoSelector], (immutableTodo) => immutableTodo.toJS() );

const dragStateSelector = (state, props) => state.getIn(['uiState', 'dragState']);
const draggedTodoSelector = (state, props) => {
  let isDragActive = state.getIn(['uiState', 'dragState', 'isDragActive']);
  if(!isDragActive) { return null; }
  let dragged_id = state.getIn(['uiState', 'dragState', 'currentDragTodoId'])
  return state.getIn(['dataState', 'todos', dragged_id.toString()]);
}
const draggedTodoObjectSelector = createSelector([draggedTodoSelector], (immutableTodo) => { 
  if(!immutableTodo) { return null; }
  return immutableTodo.toJS();
});

const dragStateObjectSelector = createSelector(
  [dragStateSelector, draggedTodoObjectSelector],
  (immutableDragState, draggedTodo) => {
    let output = immutableDragState.toJS();
    output.draggedTodo = draggedTodo;
    return output;
  }
);

const mapStateToProps = (state, ownProps) => {
  let todo = todoObjectSelector(state, ownProps);
  let todoDragState = dragStateObjectSelector(state, ownProps);

  return {
    todo: todo,
    todoDragState: todoDragState,
    isDraggedOver: (todo.id === todoDragState.currentNeighborId)
  }
}

const todoSource = {
  beginDrag(props, monitor) {
    return {
      id: props.todo.id,
      klass: props.todo.klass,
      index: props.currentIndex,
      position: props.todo.position,
      startIndex: props.todo.index
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const drop_result = monitor.getDropResult();
    const positions_jumped = (item.startIndex < item.index ? item.index - 1 : item.index) - item.startIndex;
    if(drop_result) {
      props.onTodoDropped(item.id, positions_jumped);
    }else{
      props.onTodoCancelDrag();
    }
  },
};

const todoTarget = {
  hover(props, monitor, component) {
    let isNeighborNorth = false;
    let dragged = monitor.getItem();

    const dragIndex = dragged.index;
    const hoverIndex = props.currentIndex;
    const neighborId = props.todoId;

    if((!dragIndex && dragIndex != 0) || (!hoverIndex && hoverIndex != 0)) {
      throw new Error("No draggable or target index found during drag operation");
    }

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) { return; }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Hovering over the top half of a todo means the neighbor is to the south
    // Hovering over the botom half means neighbor to the north
    if(hoverClientY <= hoverMiddleY) { isNeighborNorth = false; } // upper half of element
    if(hoverClientY > hoverMiddleY) { isNeighborNorth = true; } // lower half

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    dragged.index = hoverIndex;
    props.onTodoReorder(dragged.id, hoverIndex, neighborId, isNeighborNorth);
  },

  drop(props, monitor) {
    return {
      id: props.todo.id,
      index: props.todo.index,
      position: props.todo.position,
    }
  }
};

const renderDraggingPlaceholder = (todo, connectDragSource, connectDropTarget) => {
  return connectDropTarget(connectDragSource(
    <div className='todo-item-drag-wrap'>
      <TodoItemDragPlaceholder todo={todo} />
    </div>
  ));
}


class TodoItem extends Component {
// TODO: add propTypes back in .. ?
//  no. proptypes aren't a thing in the latest react, instead I should use
//  typescript
//
//  static propTypes = {
//    todo: PropTypes.object.isRequired,
//    onTodoClicked: PropTypes.func.isRequired
//  }
  constructor(props) {
    super(props);
    this.state = { isNestedExpanded: false };
  }

  shouldComponentUpdate(nextProps) {
    let should_update = (
      !_.isEqual(this.props.todo, nextProps.todo)
      || this.props.isDraggedOver
      || this.props.isDraggedOver != nextProps.isDraggedOver
    )
    return should_update;
  }

  renderTodoItemWrap() {
    const {
      todo,
      todoDragState,
      onTodoClicked,
      onTodoDestroyed,
      onTodoAccepted,
      onTodoTagDestroyed,
      connectDragSource,
      connectDropTarget
    } = this.props;

    return connectDropTarget(
      <div className='todo-item-drag-wrap'>
        <TodoItemWrap
          todo={todo}
          connectDragSource={connectDragSource}
          onTodoClicked={onTodoClicked}
          onTodoDestroyed={() => onTodoDestroyed(todo)}
          onTodoAccepted={() => onTodoAccepted(todo)}
        />
      </div>
    );
  }

  render() {
    const { todo, currentIndex, todoDragState } = this.props;

    if(todoDragState.isDragActive) {
      if(todoDragState.currentDragTodoId === todo.id) {
        return null; // don't render the todo that is being dragged
      }else if(todoDragState.currentNeighborId === todo.id){
        if(todoDragState.isCurrentNeighborNorth){
          return (
            <div>
              { this.renderTodoItemWrap() }
              { renderDraggingPlaceholder(todoDragState.draggedTodo, this.props.connectDragSource, this.props.connectDropTarget)}
            </div>
          )
        }else{
          return (
            <div>
              { renderDraggingPlaceholder(todoDragState.draggedTodo, this.props.connectDragSource, this.props.connectDropTarget)}
              { this.renderTodoItemWrap() }
            </div>
          )
        }
      }
    }
    return this.renderTodoItemWrap();
  }
}

export default connect(mapStateToProps)(flow(
  DragSource(ItemTypes.TODO_ITEM, todoSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.TODO_ITEM, todoTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }))
)(TodoItem))



// DEV_NOTE: This is the es7 decorator syntax.  Apparently the @Blah thing
// 'decorates' the class declaration that comes afterwards
//@DropTarget('TODO', cardTarget, connect => ({
//  connectDropTarget: connect.dropTarget()
//}))
//@DragSource('TODO', cardSource, (connect, monitor) => ({
//  connectDragSource: connect.dragSource(),
//  isDragging: monitor.isDragging()
//}))
// export default class TodoItem extends Component { ....
