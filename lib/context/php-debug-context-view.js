'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import ContextView from './context-view'

export default class PhpDebugContextView extends UiComponent {
  constructor (props,children) {
    super(props,children)
    this.globalContext = props.context;
    this.globalContext.onContextUpdate(this.updateContext)
    this.globalContext.onSessionEnd(this.sessionEnd);
  }
  render () {
    const {context,state} = this.props;
    const scopes = Object.keys(state.scopes).map((key,index) => {
      var scope = state.scopes[key];
      return <ContextView ref={'contextScope' + scope.scopeId} key={scope.scopeId} context={context} currentScope={scope} />
    });
    return <div className='php-debug-context-view pane-item native-key-bindings'>
      <div className='php-debug-contexts php-debug-contents native-key-bindings'>
        {scopes}
      </div>
    </div>
  }

  init () {
    if (!this.props.state) {
      const debugContexts = this.props.context.getCurrentDebugContext()
      this.props.state = {
        scopes : debugContexts ? debugContexts.scopeList : {}
      };
    }
    super.init()
  }

  updateContext () {
    const state = Object.assign({}, this.props.state);
    const debugContexts = this.globalContext.getCurrentDebugContext()
    state.scopes = debugContexts.scopeList;
    this.update({state:state});
  }

  sessionEnd () {
    const state = Object.assign({}, this.props.state);
    state.debugContexts = []
    this.update({state:state});
  }

}
PhpDebugContextView.bindFns = ["updateContext","sessionEnd"];
