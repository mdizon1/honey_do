import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import TodoListWrap from './TodoListWrap'
import HoneyDoConfigWrap from "../containers/HoneyDoConfigWrap"
import { UiTabs, UiTabToType } from '../constants/TodoTypes'

const renderTabContent = (currTab, props) => {
  switch(currTab){
    case UiTabs.CONFIG:
    case UiTabs.TODOS:
      return (
        <TodoListWrap
          store={props.store}
          todoType={UiTabToType[currTab]}
          isTouch={props.isTouch}
          apiEndpoint={props.appConfig.apiEndpoint}
          authToken={props.appConfig.identity.authToken}
        />
      );
    case UiTabs.SHOPPING_LIST:
      return (
        <HoneyDoConfigWrap store={props.store}/>
      );
  };
}

const TodoTabs = function (props) {
  return (
    <div className="">
      <AppBar>
        <Tabs
          value={props.currentTab}
          onChange={props.onChangeTab}
        >
          <Tab label="Configuration" value={UiTabs.CONFIG} />
          <Tab label="Todo list" value={UiTabs.TODOS}/ >
          <Tab label="Shopping list" value={UiTabs.SHOPPING_LIST} />
        </Tabs>
      </AppBar>
      { renderTabContent(props.currentTab, props) }
    </div>
  )
}

export default TodoTabs

//TodoTabs.propTypes = {
//  onChangeTab: PropTypes.func,
//  currentTab: PropTypes.string
//}



// OLD CODE/NOTES BELOW

// DEV_NOTE: This syntax seems to be part of PropTypes.  I'm not sure if it's an es6
// thing but the items listed inside the {} are the valid prop keys declared
// below in the .propTypes declaration.
// DEV_NOTE: An update, yeah this syntax is es6 not redux specific.  If the
// argument to a function is an object, you can expand it's properties into
// some variables with the ({foo, bar, baz}) syntax
//const TodoTabs = ({onClickTodoTab, onClickShoppingTab, currentTab}) => (
//  <div className='honey-do-tabs'>
//    <ul>
//      <li> Todo List </li>
//      <li> Shopping List </li>
//    </ul>
//  </div>
//)


// DEV_NOTE: I originally was using VisibleTodoList as a container component but
//   the use of react-dnd for drag and drop doesn't seem to be compatible with
//   that method of creating react components
//const TodoTabs = function (props) {
//  return (
//    <Tabs
//      value={props.currentTab}
//      onChange={props.onChangeTab}
//    >
//      <Tab label="Todo list" value="SHOW_TODOS">
//        <div>
//          <VisibleTodoList
//            apiEndpoint={props.appConfig.apiEndpoint}
//            authToken={props.appConfig.identity.authToken}
//          />
//        </div>
//      </Tab>
//      <Tab label="Shopping list" value="SHOW_SHOPPING_LIST">
//        <div>
//          Nothing here yet
//        </div>
//      </Tab>
//    </Tabs>
//  )
//}

