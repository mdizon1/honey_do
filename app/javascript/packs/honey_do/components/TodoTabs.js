import React, { PropTypes } from 'react'
import Tabs from 'material-ui/Tabs/Tabs'
import Tab from 'material-ui/Tabs/Tab'
import TodoListWrap from './TodoListWrap'
import HoneyDoConfigWrap from "../containers/HoneyDoConfigWrap"
import { UiTabs, UiTabToType } from '../constants/TodoTypes'

const renderTabContent = (props, tabType) => {
  return (
    <TodoListWrap
      store={props.store}
      todoType={UiTabToType[tabType]}
      isTouch={props.isTouch}
      apiEndpoint={props.appConfig.apiEndpoint}
      authToken={props.appConfig.identity.authToken}
      onSync={props.onSync}
    />
  );
}

const TodoTabs = function (props) {
  return (
    <Tabs
      value={props.currentTab}
      onChange={props.onChangeTab}
    >
      <Tab label="Configuration" value={UiTabs.CONFIG}>
        <div>
          <HoneyDoConfigWrap store={props.store}/>
        </div>
      </Tab>
      <Tab label="Todo list" value={UiTabs.TODOS}>
        <div>
          { renderTabContent(props, UiTabs.TODOS) }
        </div>
      </Tab>
      <Tab label="Shopping list" value={UiTabs.SHOPPING_LIST}>
        <div>
          { renderTabContent(props, UiTabs.SHOPPING_LIST) }
        </div>
      </Tab>
    </Tabs>
  )
}

TodoTabs.propTypes = {
  onChangeTab: PropTypes.func,
  currentTab: PropTypes.string
}

export default TodoTabs


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

