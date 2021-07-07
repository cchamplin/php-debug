'use babel'
/** @jsx etch.dom */

import etch from 'etch'

import UiComponent from '../ui/component'
import Editor from '../ui/editor'
import WatchView from './watch-view'
import Watchpoint from '../models/watchpoint'

export default class PhpDebugWatchView extends UiComponent {
  render () {
    const {context,state} = this.props;
    const watches = state.watches.map((watch,index) => {
      return <WatchView key={index} context={context} watchpoint={watch} />
    });
    return <div className='php-debug-watch-view pane-item' style="overflow:auto;">
      <section className='php-debug-watches php-debug-contents section'>
        <div className='editor-container'>
          <Editor ref='editor' mini={true} grammar='text.html.php'/>
        </div>
        <ul className='php-debug-watchpoints php-debug-list'>
          {watches}
        </ul>
      </section>
    </div>
  }


  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context
    //newWatchpointEditor.getModel().onWillInsertText @submitWatchpoint
    this.globalContext.onContextUpdate(this.updateWatches);
    this.globalContext.onWatchpointsChange(this.updateWatches)
    this.subscriptions.add(atom.commands.add(this.element, 'core:confirm', () => { this.confirmWatch() }))
  }

  confirmWatch() {
    const expression = this.refs.editor.getText()
    if (expression != null && expression.trim() != "") {
      const watch = new Watchpoint({expression:expression.trim()})
      this.globalContext.addWatchpoint(watch)
      this.refs.editor.setText('')
    }
  }

  init () {
    if (!this.props.state) {
      let watches = []
      if (this.props.context.getCurrentDebugContext()) {
        watches = this.props.context.getCurrentDebugContext().getWatchpoints().slice()
      } else {
        watches = this.props.context.getWatchpoints().slice()
      }
      this.props.state = {
        watches: watches
      }
    }
    super.init()
  }

  submitWatchpoint (event) {
    /*return unless event.text is "\n"
    expression = @newWatchpointEditor
      .getModel()
      .getText()
    w = new Watchpoint(expression:expression)
    @GlobalContext.addWatchpoint(w)
    @newWatchpointEditor
      .getModel()
      .setText('')
    event.cancel()*/
  }

  updateWatches () {
    const state = Object.assign({}, this.props.state);
    let watches = []
    if (this.globalContext.getCurrentDebugContext()) {
      watches = this.globalContext.getCurrentDebugContext().getWatchpoints().slice();
    } else {
      watches = this.globalContext.getWatchpoints().slice();
    }
    state.watches = watches;
    this.update({state:state})
  }
}
PhpDebugWatchView.bindFns = ["updateWatches"];
