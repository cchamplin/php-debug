'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import UiComponent from '../ui/component'
import ContextVariableView from '../context/context-variable-view'

export default class WatchView extends UiComponent {

  render () {
    const {context,state} = this.props;
    return <li className='native-key-bindings'>
      <div className='watch-item'>
        <ContextVariableView context={context} variable={state.watchData} parent={null} />
        <span onclick={this.removeWatch} className='icon close-icon' />
      </div>
    </li>
  }

  constructor (props,children) {
    super(props,children)
    this.watchpoint = props.watchpoint
    this.autoopen = props.autoopen
    this.globalContext = props.context
  }

  shouldUpdate(newProps) {
    console.log(newProps)
    if (newProps.watchpoint.value != undefined && newProps.watchpoint.value != null) {
      if (!this.props.state) {
        this.props.state = {}
      }
      this.props.state.watchData = newProps.watchpoint.value
      return true
    }
    return super.shouldUpdate(newProps)
  }

  init () {
    if (!this.props.state) {
      this.props.state = {
        watchData : {
          type : 'uninitialized',
          label : this.props.watchpoint.getExpression()
        }
      }
    }
    super.init()
  }

  removeWatch () {
    this.globalContext.removeWatchpoint(this.watchpoint)
  }
}
WatchView.bindFns = ["removeWatch"];
