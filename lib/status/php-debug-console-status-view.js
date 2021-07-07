'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'

export default class PhpDebugConsoleStatusView extends UiComponent {
  render () {
      const {state} = this.props;
      let classes = 'php-debug-console-view-toggle inline-block'
      if (state.active) {
        classes += ' active'
      }
      return <div onclick={this.toggleConsole} className={classes}>
        <span className='icon icon-terminal'></span>PHP Console
      </div>
  }

  constructor (props,children) {
      super(props,children)
      this.statusBar = props.statusBar
      this.phpDebug = props.phpDebug;

  }
  init () {
    if (!this.props.state) {
      this.props.state = {
        active: false
      }
    }
    super.init()
    this.tile = this.props.statusBar.addLeftTile({item: this.element, priority: -99})
  }

  toggleConsole() {
    this.phpDebug.toggleConsole()
  }

  setActive (active) {
    const state = Object.assign({}, this.props.state);
    state.active = active;
    this.update({state:state});
  }

  destroy() {
    if (this.tile) {
      this.tile.destroy()
      this.tile = null
    }
    super.destroy()
  }
}
PhpDebugConsoleStatusView.bindFns = ["toggleConsole","setActive"];
