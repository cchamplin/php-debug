'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import BreakpointItemView from './breakpoint-item-view'
import helpers from '../helpers'

export default class BreakpointListView extends UiComponent {

  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
    this.globalContext.onBreakpointsChange(this.updateBreakpoints);
  }

  render () {
    const {context,state} = this.props;
    const breakpointComponents = state.breakpoints.map((breakpoint,index) => {
      return <BreakpointItemView key={index} context={context} breakpoint={breakpoint} onclick={this.handleBreakpointClick} />
    });
    return <ul className="breakpoint-list-view php-debug-list">
        {breakpointComponents}
      </ul>
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

  handleBreakpointClick(breakpoint) {
    const filepath = helpers.remotePathToLocal(breakpoint.getPath())
    const line = breakpoint.getLine();
    atom.workspace.open(filepath,{searchAllPanes: true, activatePane:true}).then((editor) => {
      range = [[line-1, 0], [line-1, 0]];
      editor.scrollToBufferPosition([line-1,0]);
      editor.setCursorScreenPosition([line-1,0]);
    });
  }
}
BreakpointListView.bindFns = ["handleBreakpointClick","updateBreakpoints"]
