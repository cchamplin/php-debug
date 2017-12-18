'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'

export default class BreakpointItemView extends UiComponent {

  render () {
    const {breakpoint} = this.props;
    return <li className='breakpoint-list-item' onclick={this.handleClick}>
        <div className='breakpoint-item'>
          <span className='breakpoint-path'>{breakpoint.getPath()}</span>
          <span className='breakpoint-line'>{breakpoint.getLine()}</span>
        </div>
      </li>
  }
  handleClick () {
    this.props.onclick(this.props.breakpoint);
  }
}
BreakpointItemView.bindFns = ["handleClick"]
