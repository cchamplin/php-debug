'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import BreakpointListView from  './breakpoint-list-view'

export default class BreakpointView extends UiComponent {

  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
  }

  render () {
    const {context} = this.props;
    return <div className="breakpoints-view php-debug-breakpoints php-debug-contents native-key-bindings">
      <BreakpointListView context={context} />
    </div>
  }


}
