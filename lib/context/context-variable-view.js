'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import ContextVariableScalarView from "./context-variable-scalar-view"
import ContextVariableListView from "./context-variable-list-view"
import helpers from '../helpers'

export default class ContextVariableView extends UiComponent {

  render() {

    const {context,state,variable} = this.props;
    let renderedVariable = null;
    switch (variable.type) {
      case 'string':
      case 'numeric':
      case 'bool':
      case 'uninitialized':
      case 'error':
      case 'null':
      case 'resource':
        renderedVariable = this.renderScalar(variable)
        break;
      case 'array':
      case 'object':
        renderedVariable = this.renderComplex(variable)
        break;
      default:
        console.error("Unhandled variable type" + variable.type);
    }
    return <li className='native-key-bindings'>
      <div className='native-key-bindings'>
      {renderedVariable}
      </div>
    </li>
  }

  renderComplex(variable) {
    let variableContext = {
      parent: this.props.parent,
      identifier: variable.label,
      labels: this.props.context.getDebugEngine().getVariableLabels(variable, this.props.parent),
      variables: variable.value,
      type: variable.type,
    }
    return <ContextVariableListView variableContext={variableContext} context={this.props.context} />
  }

  renderScalar (variable) {
    let labels = this.props.context.getDebugEngine().getVariableLabels(variable,this.props.parent)
    const labelElements = labels.map((label,index) => {
      return <span className={label.classes}>{label.text}</span>
    });
    return <div>{labelElements}</div>
  }
}
