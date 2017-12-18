'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'

import BreakpointView from './breakpoint-view'


export default class PhpDebugBreakpointView extends UiComponent {
  constructor (props,children) {
    super(props,children)
    console.log("breakpoint view thing")
    this.globalContext = props.context;
    this.globalContext.onBreakpointsChange(this.updateBreakpoints)
  }

  render () {
    const {context,state} = this.props;
    return <div className='php-debug-breakpoint-view pane-item native-key-bindings'>
      <BreakpointView breakpoints={state.breakpoints} context={context} />
    </div>
  }
  init () {
    if (!this.props.state) {
      this.props.state = {
        breakpoints: this.props.context.getBreakpoints()
      };
    }
    super.init();
  }
  updateBreakpoints () {
    console.log('breakpoints changed');
    const state = Object.assign({}, this.props.state);
    const contextBreakpoints = this.globalContext.getBreakpoints();
    state.breakpoints = contextBreakpoints;
    this.update({state:state});
  }
}
PhpDebugBreakpointView.bindFns = ["updateBreakpoints"]
