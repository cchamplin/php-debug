'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import ConsoleItemView from './console-item-view'

export default class ConsoleView extends UiComponent {

  constructor(props,children) {
    super(props,children);
    this.globalContext = props.context
    this.globalContext.onConsoleMessage(this.updateConsole);
    this.globalContext.onConsoleMessagesCleared(this.clear);
  }

  // TODO perform line appends without rerendering the entire list
  render () {
    const {state, context} = this.props;
    const items = state.lines.map((line,index) => {
      return <ConsoleItemView key={index} context={context} line={line}/>
    });
    return <ul ref="viewList" className="console-list-view">
        {items}
      </ul>
  }

  readAfterUpdate() {
    this.refs.viewList.parentElement.scrollTo(0,this.refs.viewList.parentElement.scrollHeight)
  }

  init () {
    if (!this.props.state) {
      const console = this.props.context.getConsoleMessages(0)
      this.props.state = {
        currentIndex : 0,
        lines: console.lines
      }
    }
    super.init();
  }

  clear () {
    const state = Object.assign({}, this.props.state);
    state.lines = [];
    state.currentIndex = 0;
    this.update({state:state});
  }

  updateConsole () {
    const state = Object.assign({}, this.props.state);
    const console = this.globalContext.getConsoleMessages(state.currentIndex)
    state.currentIndex = console.total;
    state.lines = state.lines.concat(console.lines);
    this.update({state:state});
  }
}
ConsoleView.bindFns = ["updateConsole","clear"]
