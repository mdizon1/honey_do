import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

export default class HoneyDo extends React.Component {
  render() {
    return (
      <div className="honey-do-app-wrap">
        <h2>
          Hello woarld~!
        </h2>
        <RaisedButton label="Test button for materials" />
      </div>
    )
  }
}
