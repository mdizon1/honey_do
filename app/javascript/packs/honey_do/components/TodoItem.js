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
    isDraggedOver: (ownProps.todoId === todoDragState.currentNeighborId)
  }
}

const todoSource = {
  beginDrag(props, monitor) {
    return {
      id: props.todo.id,
      klass: props.todo.klass,
      neighborId: null,
      isNeighborNorth: null
    };
  },

  endDrag(props, monitor, component) {
    const item = monitor.getItem();
    props.onTodoDropped();
  },
};

const todoTarget = {
  hover(props, monitor, component) {
    let is_neighbor_north = false;
    let dragged = monitor.getItem();

    const drag_index = dragged.index;
    const hover_index = props.currentIndex;
    const neighbor_id = props.todoId;

    let componentNode = findDOMNode(component);
    const drag_placeholder = $(componentNode).find('.todo-item-drag-placeholder');
    let hoverBoundingRect;
    if(drag_placeholder.length > 0) {
      hoverBoundingRect = drag_placeholder.parent().siblings()[0].getBoundingClientRect();
    }else{
      hoverBoundingRect = componentNode.getBoundingClientRect();
    }

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if(hoverClientY <= hoverMiddleY) { is_neighbor_north = true; } // upper half of element
    if(hoverClientY > hoverMiddleY) { is_neighbor_north = false; } // lower half

    if(
      dragged.neighborId === neighbor_id &&
      dragged.isNeighborNorth === is_neighbor_north
    ){ return; }
    dragged.isNeighborNorth = is_neighbor_north;
    dragged.neighborId = neighbor_id;

    props.onTodoReorder(dragged.id, neighbor_id, is_neighbor_north);
  },

  drop(props, monitor, component) {

    // It doesn't appear that this is reliable, endDrag always gets called but
    // this one doesn't

//    const drop_result = monitor.getDropResult();
//    if(!drop_result) { props.onTodoCancelDrag(); }
//    props.onTodoDropped();
    return {
      id: props.todo.id,
//      index: props.todo.index,
//      position: props.todo.position,
    }
  }
};

const renderDraggingPlaceholder = (todo, connectDropTarget) => {
  return (
    <div className='todo-item-drag-wrap'>
      <TodoItemDragPlaceholder todo={todo} />
    </div>
  );
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
      || (this.props.todoDragState.isDragActive && !nextProps.todoDragState.isDragActive) // rerender all when stop dragging
      || this.props.isDraggedOver
      || this.props.isDraggedOver != nextProps.isDraggedOver
      || ( this.props.isDraggedOver
        && this.props.todoDragState.isNeighborNorth != nextProps.todoDragState.isNeighborNorth)
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
    const { todo, todoDragState } = this.props;

    if(todoDragState.isDragActive) {
      if(todoDragState.currentDragTodoId === todo.id) {
        return null; // don't render the todo that is being dragged
      }else if(todoDragState.currentNeighborId === todo.id){
        if(todoDragState.isNeighborNorth){
          return (
            <div>
              { this.renderTodoItemWrap() }
              { renderDraggingPlaceholder(todoDragState.draggedTodo, this.props.connectDropTarget)}
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
