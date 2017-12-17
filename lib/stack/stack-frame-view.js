'use babel'
/** @jsx etch.dom */

import { CompositeDisposable } from 'atom'
import etch from 'etch'
import UiComponent from '../ui/component'
import UiStoreComponent from '../ui/store-component'
import {remotePathToLocal} from '../helpers'

export default class StackFrameView extends UiComponent {

render () {
    const {frame} = this.props;
    return <li className="" onclick={this.handleClick}>
        <div className='stack-frame-level text-info inline-block-tight' data-level={frame.id}> {frame.id}</div>
        <div className='stack-frame-label text-info inline-block-tight'>{frame.label}</div>
        <div className='stack-frame-filepath text-smaller inline-block-tight' data-path={remotePathToLocal(frame.filepath)}>{remotePathToLocal(frame.filepath)}</div>
        <div className='stack-frame-line text-smaller inline-block-tight' data-line={frame.line}>{'(' + frame.line + ')'}</div>
      </li>
  }
  handleClick () {
    this.props.onclick(this.props.frame);
  }
}
StackFrameView.bindFns = ["handleClick"];
