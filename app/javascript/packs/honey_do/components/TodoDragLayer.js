import React, { Component, PropTypes } from 'react'
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
          <div style={getItemStyles(this.props)}>
            <h4> Hey! Put me down! </h4>
          </div>
        </div>
      );
    }
  }
}

export default DragLayer(collect)(TodoDragLayer);
