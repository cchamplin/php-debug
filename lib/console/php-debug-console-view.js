'use babel'
/** @jsx etch.dom */

import { CompositeDisposable } from 'atom'
import etch from 'etch'
import UiComponent from '../ui/component'
import Editor from '../ui/editor'
import ConsoleView from './console-view'

export class PhpDebugConsoleView extends UiComponent {
  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
    this.globalContext.onPreviousConsoleCommand(this.previousCommand);
    this.globalContext.onNextConsoleCommand(this.nextCommand);
    this.subscriptions.add(atom.commands.add(this.element, 'core:confirm', () => { this.confirmCommand() }))
  }


  render () {
    const {context} = this.props;
    console.log("contexter!!")
    console.log(context);
    return <div className="php-debug-console-view php-debug-console">
            <div className='php-debug-console-view-container'>
              <div className="block actions">
                <span className="panel-title">PHP Console</span>
                <button className="btn octicon icon-circle-slash inline-block-tight" data-action='clear' onclick={this.handleClearClick}>
                  <span className="btn-text">Clear Console</span>
                </button>
              </div>
              <section className='console-panel section'>
                <div className='php-debug-console-contents php-debug-contents native-key-bindings'>
                  <ConsoleView context={context} />
                </div>
                <div className='editor-container'>
                  <Editor ref='editor' mini={true} grammar='text.html.php'/>
                </div>
              </section>
            </div>
          </div>
  }



  handleClearClick () {
    this.globalContext.clearConsoleMessages()
  }


  init () {
    if (!this.props.state) {
      this.props.state = {
        currentCommand: 0,
        stack : []
      }
    }
    super.init()
  }

  confirmCommand() {
    console.log('confirm')
    let expression = this.refs.editor.getText()
    // enqueue entered command, limit stack size and update index
    this.props.state.stack.push(expression)
    if (this.props.state.stack.length > 20) {
      this.props.state.stack.shift()
    }
    this.props.state.currentCommand = this.props.state.stack.length
    this.globalContext.addConsoleMessage(">" + expression);
    let debugContext = null;
    if ((debugContext = this.globalContext.getCurrentDebugContext()) != null) {
      debugContext.evalExpression(expression)
    }
    this.refs.editor.setText('')
  }

  handleSubmit (event) {
    if (event.text != "\n") {
      return;
    }
    confirmCommand()
    event.cancel()
  }

  previousCommand () {
    if (!this.props.state.stack.length) {
      return;
    }
    let len = this.props.state.stack.length
    if (this.props.state.currentCommand > 0) {
      this.props.state.currentCommand -= 1;
    }
    this.refs.editor.setText(this.props.state.stack[this.props.state.currentCommand])
  }

  nextCommand () {
    if (!this.props.state.stack.length) {
      return;
    }
    let len = this.props.state.stack.length
    if (this.props.state.currentCommand < len) {
      this.props.state.currentCommand += 1;
    }
    if (this.props.state.currentCommand < len) {
      this.refs.editor.setText(this.props.state.stack[this.props.state.currentCommand])
    } else {
      this.refs.editor.setText('')
    }
  }
}
PhpDebugConsoleView.bindFns = ["handleSubmit","handleClearClick","previousCommand","nextCommand"];

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
    return "Console";
  }

  getDefaultLocation () {
    return 'bottom'
  }

  getAllowedLocations () {
    return ['bottom']
  }
  createPanel(visible) {
    console.log("Create Panel");
    if (!this.component) {
      console.log("create component");
      console.log(this.globalContext);
      this.component = new PhpDebugConsoleView({context:this.globalContext});
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
