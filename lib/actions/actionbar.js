'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import UiComponent from '../ui/component'

export default class ActionBar extends UiComponent {
  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
    this.globalContext.onBreak(() => {
      this.enableButtons();
    });
    this.globalContext.onRunning(() => {
      this.disableButtons();
    });
    this.globalContext.onSessionEnd(() => {
      this.disableButtons();
    })
  }
  render() {
    const {context,state,mini} = this.props;
    let classes = 'action-bar padded'
    if (mini) {
      classes += ' mini';
    }
    return <div className={classes}>
      <div className='php-debug-view-buttons'>
        <button className= "btn btn-no-deactive restore-btn inline-block-tight" onclick={this.handleRestorePanels}><i class="mdi mdi-window-restore"></i>Restore Panels</button>
      </div>
      <div className='php-debug-action-buttons'>
        <button className="btn btn-action octicon icon-playback-play inline-block-tight" disabled={!state.buttons.continue} onclick={this.handleContinueDebugging}>
          <span className="btn-text">Continue</span>
        </button>
        <button className="btn btn-action octicon icon-steps inline-block-tight" disabled={!state.buttons.stepover} onclick={this.handleStepOver}>
          <span className="btn-text"> Step Over</span>
        </button>
        <button className="btn btn-action octicon icon-sign-in inline-block-tight" disabled={!state.buttons.stepin} onclick={this.handleStepIn}>
          <span className="btn-text">Step In</span>
        </button>
        <button className="btn btn-action octicon icon-sign-out inline-block-tight" disabled={!state.buttons.stepout} onClick={this.handleStepOut}>
          <span className="btn-text"> Step Out</span>
        </button>
        <button className="btn btn-action octicon icon-primitive-square inline-block-tight" disabled={!state.buttons.stop}  onClick={this.handleStopDebugging}>
          <span className="btn-text">Stop</span>
        </button>
      </div>
    </div>
  }

  init () {
    if (!this.props.state) {
      this.props.state = {
        buttons : {
          continue : false,
          stepin : false,
          stepover : false,
          stepout : false,
          stop: false
        }
      }
    }
    super.init()
  }

  enableButtons() {
    const state = Object.assign({}, this.props.state)
    for (var button in state.buttons) {
      state.buttons[button] = true;
    }
    this.update({state:state});
  }
  disableButtons() {
    const state = Object.assign({}, this.props.state)
    for (var button in state.buttons) {
      state.buttons[button] = false;
    }
    this.update({state:state});
  }

  handleRestorePanels () {
    if (this.props.onRestorePanels) {
      this.props.onRestorePanels()
    }
  }

  handleContinueDebugging () {
    if (!this.globalContext.getCurrentDebugContext()) return;
    this.globalContext.getCurrentDebugContext().continue("run")
  }
  handleStepOver () {
    if (!this.globalContext.getCurrentDebugContext()) return;
    this.globalContext.getCurrentDebugContext().continue("step_over");
  }
  handleStepIn () {
    if (!this.globalContext.getCurrentDebugContext()) return;
    this.globalContext.getCurrentDebugContext().continue("step_into")
  }
  handleStepOut () {
    if (!this.globalContext.getCurrentDebugContext()) return;
    this.globalContext.getCurrentDebugContext().continue("step_out");
  }
  handleStopDebugging () {
    if (!this.globalContext.getCurrentDebugContext()) return;
    this.globalContext.getCurrentDebugContext().executeDetach();
  }
}
ActionBar.bindFns = ['handleStepOut', 'handleRestorePanels', 'handleContinueDebugging',
'handleStepOver', 'handleStepIn', 'handleStopDebugging','enableButtons','disableButtons']
