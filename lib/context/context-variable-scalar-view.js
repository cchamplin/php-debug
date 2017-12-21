'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import helpers from'../helpers'
export default class ContextVariableScalarView extends UiComponent {
  render () {
    return <div>
      <span className='variable php'>params.label</span>
      <span className='type php'>params.value</span>
      </div>
    }
}
