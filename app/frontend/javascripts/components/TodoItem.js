import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { ItemTypes } from './../constants/ItemTypes'
import flow from 'lodash/flow'

import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// LEFT OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   Drag and drop is working
//   Need to build/handle the ajax call
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const todoSource = {
  beginDrag(props, monitor) {
    console.log("DEBUG: Drag source drag begins");
    return {
      id: props.todo.id,
      position: props.todo.position
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    console.log("DEBUG: Drag source drag ends");
    if(dropResult) {
      props.onTodoDropped(item.id, dropResult.position)
      // something something...
    }
  }
};

const todoTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

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
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    //props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },

  drop(props, monitor) {
    // the props here are from the dropTarget
    console.log("DEBUG: Todo was dropped, here we need to get the correct arguments to tell who was dropped and where...");
    return {
      id: props.todo.id,
      position: props.todo.position,
    }
  }
};

const renderCheckbox = (todo, handleClick) => {
  return (
    <Checkbox 
      checked={todo.isCompleted}
      onCheck={() => handleClick(todo.id, todo.isCompleted)}
    />
  )
}

class TodoItem extends Component {
// TODO: add propTypes back in .. ?
//  static propTypes = {
//    todo: PropTypes.object.isRequired,
//    onTodoClicked: PropTypes.func.isRequired
//  }

  render() {
    const { todo, onTodoClicked, isDragging, connectDragSource, connectDropTarget } = this.props;

    if(this.props.isOver){
      console.log("DEBUG: isOver is happening");
    }

    if(this.props.isDragging){
      return connectDragSource(
        <div> Placeholder </div>
      )
    }
    return connectDropTarget(connectDragSource(
      <div>
        <ListItem
          primaryText={todo.title}
          secondaryText={todo.notes}
          leftCheckbox={renderCheckbox(todo, onTodoClicked)}
          nestedItems={[
            <ListItem
              key={"todo_notes_"+todo.id}
              primaryText={todo.notes}
            />,
          ]}
        />
      </div>
    ));
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



