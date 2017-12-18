'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import BreakpointItemView from './breakpoint-item-view'
import helpers from '../helpers'

export default class BreakpointListView extends UiComponent {

  render () {
    const {context,breakpoints} = this.props;
    const breakpointComponents = breakpoints.map((breakpoint,index) => {
      return <BreakpointItemView key={index} context={context} breakpoint={breakpoint} onclick={this.handleBreakpointClick} />
    });
    return <ul className="breakpoint-list-view">
        {breakpointComponents}
      </ul>
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
BreakpointListView.bindFns = ["handleBreakpointClick"]
