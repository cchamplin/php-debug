'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'

import BreakpointView from './breakpoint-view'


export default class PhpDebugBreakpointView extends UiComponent {
  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
  }

  render () {
    const {context,state} = this.props;
    return <div className='php-debug-breakpoint-view pane-item native-key-bindings'>
      <BreakpointView context={context} />
    </div>
  }
}
