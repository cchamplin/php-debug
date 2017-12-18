'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import BreakpointListView from  './breakpoint-list-view'

export default class BreakpointView extends UiComponent {

  render () {
    const {context, breakpoints} = this.props;
    return <div className="breakpoints-view php-debug-breakpoints php-debug-contents native-key-bindings">
      <BreakpointListView context={context} breakpoints={breakpoints} />
    </div>
  }
}
