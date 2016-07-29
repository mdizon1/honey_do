import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from '../constants/ItemTypes'
import { editTodoRequest } from '../actions/HoneyDoActions'
import flow from 'lodash/flow'

import TodoItemWrap from '../containers/TodoItemWrap'
import ListItem from 'material-ui/List/ListItem'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import IconMenu from 'material-ui/IconMenu/IconMenu'
import IconButton from 'material-ui/IconButton/IconButton'
import MenuItem from 'material-ui/MenuItem/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const iconButtonElement = (
  <IconButton touch={true}>
    <MoreVertIcon color={"#333"} />
  </IconButton>
);

const todoSource = {
  beginDrag(props, monitor) {
    return {
      id: props.todo.id,
      index: props.todo.index,
      position: props.todo.position,
      startIndex: props.todo.index
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const drop_result = monitor.getDropResult();
    const positions_jumped = monitor.getItem().index - monitor.getItem().startIndex;
    if(drop_result) {
      props.onTodoDropped(item.id, positions_jumped)
    }
  },
};

const todoTarget = {
  hover(props, monitor, component) {
    let dragged = monitor.getItem();

    const dragIndex = dragged.index;
    const hoverIndex = props.todo.index;

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

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return; }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return; }

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    dragged.index = hoverIndex;
    props.onTodoReorder(dragged.id, hoverIndex);
  },

  drop(props, monitor) {
    return {
      id: props.todo.id,
      index: props.todo.index,
      position: props.todo.position,
    }
  }
};

const renderCheckbox = (todo, handleClick) => {
  return (
    <Checkbox 
      checked={todo.isCompleted}
      onCheck={() => handleClick(todo)}
      disabled={todo.isCompleted && !todo.permissions.canUncomplete}
    />
  )
}

const renderDraggingPlaceholder = (props) => {
  const { todo, onTodoClicked, connectDragSource, connectDropTarget } = props;
  return connectDropTarget(connectDragSource(
    <div className="todo-item todo-item-drag-placeholder">
      <ListItem
        primaryText={todo.title}
        secondaryText={todo.notes}
        leftCheckbox={renderCheckbox(todo, onTodoClicked)}
      />
    </div>
  ));
}


class TodoItem extends Component {
// TODO: add propTypes back in .. ?
//  static propTypes = {
//    todo: PropTypes.object.isRequired,
//    onTodoClicked: PropTypes.func.isRequired
//  }
  constructor(props) {
    super(props);
    this.state = { isNestedExpanded: false };
  }

  toggleNotes() {
    this.setState({isNestedExpanded: !this.state.isNestedExpanded});
  }

  triggerDestroy() {
    this.props.onTodoDestroyed(this.props.todo);
  }

  triggerEdit() {
    this.props.dispatch(editTodoRequest(this.props.todo));
  }


  renderTodoItemWrap() {
    const { todo, onTodoClicked, onTodoDestroyed, onTodoAccepted, connectDragSource, connectDropTarget } = this.props;
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
    const { todo, isDragging } = this.props;

    if(isDragging) {
      return renderDraggingPlaceholder(this.props);
    }

    return this.renderTodoItemWrap();
  }
}

// DEV_NOTE: looks like flow was the secret sauce here.  Since es7 decorators 
//   aren't yet available, if I want to apply multiple decorators in es6, I 
//   need lodash's flow to apply them in chain
export default flow(
  DragSource(ItemTypes.TODO_ITEM, todoSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.TODO_ITEM, todoTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }))
)(TodoItem)

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
