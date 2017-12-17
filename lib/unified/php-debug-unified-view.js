'use babel'
/** @jsx etch.dom */

import { CompositeDisposable } from 'atom'
import etch from 'etch'
import UiComponent from '../ui/component'
import UiStoreComponent from '../ui/store-component'

import Collapsable from '../ui/collapsable'

import {PhpDebugContextView} from '../context/php-debug-context-view'
import PhpDebugStackView from '../stack/php-debug-stack-view'
import {PhpDebugWatchView}  from '../watch/php-debug-watch-view'
import {PhpDebugBreakpointView} from '../breakpoint/php-debug-breakpoint-view'

export class PhpDebugUnifiedView extends UiComponent {
  constructor (props, children) {
    super(props,children);
    console.log('constructor');
    console.log(props);
    console.log(children);
    this.globalContext = props.context;
    this.contextList = [];
    this.globalContext.onBreak(() => {
      this.enableButtons();
    });
    this.globalContext.onRunning(() => {
      this.disableButtons();
    });
    this.globalContext.onSessionEnd(() => {
      this.disableButtons();
      this.setConnected(false);
    })
    this.globalContext.onSessionStart(() => {
      this.setConnected(true);
    })

  }
  render() {
    const {context,state} = this.props;
    return <div className='php-debug' tabindex="-1">
        <div className='php-debug-unified-view'>
          <div className='block action-bar'>
            <div className='php-debug-view-buttons'>
              <button className= "btn btn-no-deactive restore-btn mdi mdi-window-restore inline-block-tight" onclick={this.handleRestorePanels}>"Restore Panels"</button>
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
          <div className='tabs-wrapper' outlet='tabsWrapper'>
            <span className="connection-status">{state.connectStatus}</span>
            <div className='tabs-view'>
              <Collapsable expanded={state.tabs.stackView.expanded} closed={state.tabs.stackView.closed} name='stackView' title='Stack Trace' onClose={this.handleCloseChange} onChange={this.handleCollapseChange}>
                <PhpDebugStackView context={context} />
              </Collapsable>
              <Collapsable expanded={state.tabs.contextView.expanded} closed={state.tabs.contextView.closed} name='contextView' title='Context' onClose={this.handleCloseChange} onChange={this.handleCollapseChange}>
                <PhpDebugContextView context={context} />
              </Collapsable>
              <Collapsable expanded={state.tabs.watchpointView.expanded} closed={state.tabs.watchpointView.closed} name='watchpointView' title='Watchpoints' onClose={this.handleCloseChange} onChange={this.handleCollapseChange}>
                <PhpDebugWatchView context={context} />
              </Collapsable>
              <Collapsable expanded={state.tabs.breakpointView.expanded} closed={state.tabs.breakpointView.closed} name='breakpointView' title='Breakpoints' onClose={this.handleCloseChange} onChange={this.handleCollapseChange}>
                <PhpDebugBreakpointView context={context} />
              </Collapsable>
            </div>
          </div>
        </div>
      </div>
  }

  handleCollapseChange (name) {
    const state = Object.assign({}, this.props.state)
    state.tabs[name].expanded = !state.tabs[name].expanded
    this.update({state:state})
  }
  handleCloseChange (name) {
    const state = Object.assign({}, this.props.state)
    state.tabs[name].closed = true;
    this.update({state:state})
  }

  handleRestorePanels() {
    const state = Object.assign({}, this.props.state)
    for (var tab in state.tabs) {
      state.tabs[tab].closed = false;
    }
    this.update({state:state})
  }

  serialize () {
    return {
      deserializer: constructor.name,
      uri: getURI()
    }
  }

  setConnected(isConnected) {
    const state = Object.assign({}, this.props.state)
    if (isConnected) {
      state.connectStatus = 'Connected';
    } else {
      var serverPort = atom.config.get('php-debug.ServerPort')
      var serverAddress = atom.config.get('php-debug.ServerAddress')
      state.connectStatus = "Listening on address:port #{serverAddress}:#{serverPort}...";
    }
    this.update({state:state})
  }

  handleContinueDebugging () {
    this.globalContext.getCurrentDebugContext().continue("run")
  }
  handleStepOver () {
    this.globalContext.getCurrentDebugContext().continue("step_over");
  }
  handleStepIn () {
    this.globalContext.getCurrentDebugContext().continue("step_into")
  }
  handleStepOut () {
    this.globalContext.getCurrentDebugContext().continue("step_out");
  }
  handleStopDebugging () {
    this.globalContext.getCurrentDebugContext().executeDetach();
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

  init () {
    console.log('initing');
    if (!this.props.state) {
      this.props.state = {
        buttons : {
          continue : false,
          stepin : false,
          stepover : false,
          stepout : false,
          stop: false
        },
        tabs : {
          stackView : {
            expanded : true,
            closed: false
          },
          breakpointView : {
            expanded : true,
            closed: false
          },
          contextView : {
            expanded : true,
            closed: false
          },
          watchpointView : {
            expanded : true,
            closed: false
          }
        },
        connectStatus : ""
      };
    }
    super.init()
  }

  destroy (removeNode = false) {
    super.destroy(removeNode)
    if (this.globalContext.getCurrentDebugContext()) {
      this.globalContext.getCurrentDebugContext().executeDetach()
    }
  }
  isEqual (other) {
      return (other instanceof PhpDebugUnifiedView);
  }
}
PhpDebugUnifiedView.bindFns = [
  'handleCollapseChange', 'handleCloseChange',
  'handleStepOut', 'handleRestorePanels', 'handleContinueDebugging',
  'handleStepOver', 'handleStepIn', 'handleStopDebugging'
]

/*export const PanelContainer = UiStoreComponent.create(
  PhpDebugUnifiedView,
  (context) => {
    return {
      context: context.context
    }
  }
);*/

export class PanelManager {
  constructor (context) {
    this.globalContext = context.context;
    this.uri = context.uri;
    this.subscriptions = new CompositeDisposable();
  }
  dispose() {
    const pane = atom.workspace.paneForItem(this.atomPanel)
    if (pane) {
      pane.destroyItem(this.atomPanel,true);
    }
    this.subscriptions.dispose();
    this.subscriptions = null;
    this.component = null;
    this.atomPanel = null;
  }
  getURI () {
    return this.uri
  }

  getTitle () {
    return "Debugging";
  }

  getDefaultLocation () {
    return 'bottom'
  }

  getAllowedLocations () {
    return ['bottom','right']
  }
  createPanel(visible) {
    console.log("Create Panel");
    if (!this.component) {
      console.log("create component");
      this.component = new PhpDebugUnifiedView({context:this.globalContext});
      console.log(this.component);
      this.subscriptions.add(this.component);
    }
    if (!this.atomPanel) {
      this.atomPanel = {
        element: this.component.element,
        getURI: this.getURI,
        getTitle: this.getTitle,
        getDefaultLocation: this.getDefaultLocation,
        getAllowedLocations: this.getAllowedLocations
      };
    }
    if (atom.workspace.paneContainerForItem(this.atomPanel)) {
        return;
    }
    atom.workspace.open(this.atomPanel, {activePane:this.visible});
  }

  getPanel (visible) {
    var panel = atom.workspace.paneContainerForItem(this.atomPanel);
    if (!panel) {
      this.createPanel(this.visible);
      return null;
    }
    return panel;
  }

  setVisible (visible) {
    this.visible = visible;
    if (visible) {
      var panel = this.getPanel(true);
      if (panel) {
        panel.show();
      }
      //var serverPort = atom.config.get('php-debug.ServerPort');
      //var serverAddress = atom.config.get('php-debug.ServerAddress');
      //this.connectStatus.text("Listening on address:port #{serverAddress}:#{serverPort}...");
    } else {
      var panel = this.getPanel(false)
      if (panel) {
        panel.hide()
      }
    }
  }

  isVisible () {
    const paneContainer = atom.workspace.paneContainerForItem(this.atomPanel)
    if (!paneContainer) {
      this.createPanel(true)
      return
    }
    return paneContainer.isVisible();
  }
  togglePanel (visible) {
    const paneContainer = atom.workspace.paneContainerForItem(this.atomPanel)
    if (!paneContainer) {
      this.createPanel(true)
      return
    }
    if (visible === undefined) {
      visible = !paneContainer.isVisible()
    }
    if (visible) {
      paneContainer.show()
    } else {
      paneContainer.hide()
    }
  }
}
