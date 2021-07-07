'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import ContextVariableListView from './context-variable-list-view'

export default class ContextView extends UiComponent {

  render () {
    const {state,context} = this.props;
    const variableContext = {
      parent: null,
      identifier: state.scope.name,
      label: state.scope.name,
      labels: context.getDebugEngine().getVariableLabels(state.scope),
      variables: state.scope.context ? state.scope.context.variables : [],
      type: null
    };
    return <li className="php-scope-list php-debug-list">
      <ContextVariableListView context={context} variableContext={variableContext} />
    </li>
  }

  update (properties) {
    if (this.props.state.scope != properties.currentScope) {
      let scope = properties.currentScope;
      if (atom.config.get('php-debug.SortArray')) {
        fnWalkVar(scope.context.variables);
      }
      this.props.state.scope = scope;
    }
    super.update(properties)
  }

  init () {
    if (!this.props.state) {
      let scope = this.props.currentScope;
      if (atom.config.get('php-debug.SortArray')) {
        fnWalkVar(scope.context.variables);
      }
      this.props.state = {
        scope : scope
      }
    }
    super.init()
  }

  fnWalkVar (contextVar) {
    if (Array.isArray(contextVar)) {
      for (let item in contextVar) {
        if (Array.isArray(item.value)) {
          fnWalkVar(item.value)
        }
      }
      contextVar.sort(cbDeepNaturalSort)
    }
  }

  cbDeepNaturalSort (a,b) {
      let aIsNumeric = /^\d+$/.test(a.name)
      let bIsNumeric = /^\d+$/.test(b.name)
      // cannot exist two equal keys, so skip case of returning 0
      if (aIsNumeric && bIsNumeric) { // order numbers
        if (parseInt(a.name, 10) < parseInt(b.name, 10)) {
          return -1
        } else {
          return 1
        }
      } else if (!aIsNumeric && !bIsNumeric) { // order strings
        if (a.name < b.name) {
          return -1
        } else {
          return 1
        }
      } else { // string first (same behavior that PHP's `ksort`)
        if (aIsNumeric) {
          return 1
        } else {
          return -1
        }
      }
  }
}
