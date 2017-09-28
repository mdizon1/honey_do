import React, { Component, PropTypes } from 'react'
import Checkbox from 'material-ui/Checkbox/Checkbox'
import { ItemTypes } from './../constants/ItemTypes'
import { DragLayer } from 'react-dnd'

const collect = (monitor) => {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
};

const getItemStyles = (props) => {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

const _renderNotes = (todo) => {
  let notes_class;
  notes_class = "todo-item-notes";
  notes_class += " todo-item-notes-truncated";
  return ( 
    <div className={notes_class}>
      { todo.notes }
    </div>
  )
}

const _renderTitle = (todo) => {
  return (
    <div className='todo-item-title'>
      <h4> { todo.title } </h4>
    </div>
  )
}

class TodoDragLayer extends Component {
  render() {
    const { item, itemType, isDragging } = this.props;

    if(!isDragging) { return null; }
    if(itemType == ItemTypes.TODO_ITEM) {
      return (
        <div 
          className="todo-item todo-item-drag-placeholder"
          style={layerStyles}
        > 

          <div className="todo-item">
            <div className="row">
              <div className="col-2">
                <div className={"todo-item-checkbox" + (item.isCompleted ? ' checkbox-checked' : '')}>
                  <Checkbox
                    checked={item.isCompleted}
                    disabled={item.isCompleted && !item.permissions.canUncomplete}
                  />
                </div>
              </div>
              <div className="col-10">
                <div className={"todo-item-content"}>
                  { _renderTitle(item) }
                  { _renderNotes(item) }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default DragLayer(collect)(TodoDragLayer);
//          <div style={getItemStyles(this.props)}>
//            <h4> Hey! Put me down! </h4>
//          </div>
