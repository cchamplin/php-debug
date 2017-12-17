'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from './component'

export default class Collapsable extends UiComponent {
  render () {
    const { expanded, title } = this.props
    return <div className='php-debug-collapsable' dataset={{ expanded }}>
      <div className='php-debug-collapsable-header panel-heading' onclick={this.handleCollapseChange}>
        <span className={'php-debug-icon icon icon-chevron-' + (expanded ? 'down' : 'right')} />
        <span className='close-icon' />
        {title}
      </div>
      <div className='php-debug-collapsable-body'>
        {this.children}
      </div>
    </div>
  }

  handleCollapseChange () {
    this.props.onChange(this.props.name)
  }
}
Collapsable.bindFns = ['handleCollapseChange']
