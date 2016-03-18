import React, { PropTypes } from 'react'
import Tabs from 'material-ui/lib/tabs/tabs'
import Tab from 'material-ui/lib/tabs/tab'
import VisibleTodoList from '../containers/VisibleTodoList'


// DEV_NOTE: This syntax seems to be part of PropTypes.  I'm not sure if it's an es6 
// thing but the items listed inside the {} are the valid prop keys declared 
// below in the .propTypes declaration
//const TodoTabs = ({onClickTodoTab, onClickShoppingTab, currentTab}) => (
//  <div className='honey-do-tabs'>
//    <ul>
//      <li> Todo List </li>
//      <li> Shopping List </li>
//    </ul>
//  </div>
//)

const TodoTabs = function (props) {
  return (
    <Tabs
      value={props.currentTab}
      onChange={props.onChangeTab}
    >
      <Tab label="Todo list" value="SHOW_TODOS">
        <div>
          <VisibleTodoList 
            apiEndpoint={props.appConfig.apiEndpoint}
            authToken={props.identityConfig.authToken}
          />
        </div>
      </Tab>
      <Tab label="Shopping list" value="SHOW_SHOPPING_LIST">
        <div>
          Nothing here yet
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
