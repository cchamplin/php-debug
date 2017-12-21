'use babel'
/** @jsx etch.dom */

import { CompositeDisposable } from 'atom'
import etch from 'etch'
import UiComponent from '../ui/component'
import UiStoreComponent from '../ui/store-component'

import StackFrameView from './stack-frame-view';
import Codepoint from '../models/codepoint';
export default class PhpDebugStackView extends UiComponent {
  constructor (props,children) {
    super(props,children);
    this.globalContext = props.context;
    this.globalContext.onContextUpdate(this.getStackFrames);
    this.globalContext.onSessionEnd(() => {
        this.emptyStackFrames();
    });
    console.log("registered stack view");
  }

  render () {
    console.log('rendering');
    const {context,state} = this.props;
    const frames = state.stackFrames.map((frame,index) => {
      return <StackFrameView key={index} context={context} frame={frame} onclick={this.handleFrameClick} />
    });
    if (frames.length) {
      return <div className='php-debug-stack-view pane-item native-key-bindings' style="overflow:auto;" tabindex='-1'>
                <ul className='php-debug-stacks php-debug-contents native-key-bindings'>
                {frames}
                </ul>
            </div>
    } else {
    return <div className='php-debug-stack-view pane-item native-key-bindings' style="overflow:auto;" tabindex='-1'>
              <ul className='php-debug-stacks php-debug-contents native-key-bindings'>
              </ul>
          </div>
        }
    }

  init () {
    console.log('init stack frames');
    this.props.state = { stackFrames : []};
    super.init()
  }

  getStackFrames() {
    console.log("Fetching stack frames");
    const state = Object.assign({}, this.props.state);
    const debugContext = this.globalContext.getCurrentDebugContext();
    state.stackFrames = [];
    for (let stackFrame of debugContext.getStack()) {
      if (stackFrame == undefined || stackFrame == null) {
        continue;
      }
      state.stackFrames.push(stackFrame);
    }
    console.log(state);
    this.update({state:state});
  }

  emptyStackFrames () {
    const state = Object.assign({}, this.props.state);
    state.stackFrames = [];
    this.update({state:state});
  }

  handleFrameClick (item) {
    console.log(item);
    this.globalContext.notifyStackChange(new Codepoint({
      filePath: item.filepath,
      line: item.line,
      stackDepth: item.id
    }));
  }

}
PhpDebugStackView.bindFns = ["handleFrameClick","getStackFrames","emptyStackFrames"];
