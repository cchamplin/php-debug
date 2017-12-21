'use babel'
/** @jsx etch.dom */

import etch from 'etch'
import UiComponent from '../ui/component'
import ActionBar from './actionbar'
import Editor from '../ui/editor'

export default class OverlayBar extends UiComponent {

  constructor (props,children) {
    super(props,children)
  }

  render () {
    const {context,state} = this.props;

    return <div className='php-debug-action-bar-overlay'>
              <ActionBar context={context} mini={true} />
            </div>
  }

  attach () {
    this.panel = atom.workspace.addModalPanel({item: this.element,className:'php-debug-action-bar-modal'});
    console.log(this.panel);
    if (this.panel) {
      document.body.addEventListener('mousemove',this.mouseMove);
      this.panel.element.addEventListener('mousedown',this.mouseDown);
      document.body.addEventListener('mouseup',this.mouseUp);
      window.addEventListener('mouseleave',this.mouseLeave);
      document.body.addEventListener('mouseleave',this.mouseLeave);
      window.addEventListener('blur',this.onBlur);
    }
  }

  init () {
    if (!this.props.state) {
      this.props.state = {
        dragging : false
      }
    }
    super.init();
  }

  mouseLeave (event) {
    this.props.state.dragging = false;
  }

  onBlur (event) {
    this.props.state.dragging = false;
  }

  mouseMove (event) {
    if (this.props.state && this.props.state.dragging) {
      console.log('moving element');
        this.panel.element.style.left = (event.clientX + parseInt(this.props.state.offsetX,10)) + 'px';
        this.panel.element.style.top = (event.clientY + parseInt(this.props.state.offsetY,10)) + 'px';
    }

  }
  mouseDown (event) {
    if (this.props.state && this.panel && this.panel.element) {
      console.log("down",event);
      let style = window.getComputedStyle(this.panel.element);
      //console.log(style);
      this.props.state.offsetX = parseInt(style.getPropertyValue("left"),10) - event.clientX
      this.props.state.offsetY = parseInt(style.getPropertyValue("top"),10) - event.clientY
      this.props.state.dragging = true;
      console.log(this.props.state)
    }
  }

  mouseUp (event) {
    if (this.props.state && this.props.state.dragging) {
        console.log("up",event);
      this.panel.element.style.left = (event.clientX + parseInt(this.props.state.offsetX,10)) + 'px';
      this.panel.element.style.top = (event.clientY + parseInt(this.props.state.offsetY,10)) + 'px';
      this.props.state.dragging = false;
    }
  }

  /*dragOver (event) {
    if (!event.dataTransfer) return;
    let data = event.dataTransfer.getData("text/plain");
    if (!data) return;
    const parts = data.split(',');
    if (parts.length != 3) return;

    let offsetX = parts[0];
    let offsetY = parts[1];
    let item = parts[2];
    if (item != 'debug-overlay') return;

    event.preventDefault();
    return false;
  }
  dragStop (event) {
    console.log('dragStop')
    if (!this.panel) return;
    if (!event.dataTransfer) return;
    let data = event.dataTransfer.getData("text/plain");
    if (!data) return;
    const parts = data.split(',');
    if (parts.length != 3) return;
    let offsetX = parts[0];
    let offsetY = parts[1];
    let item = parts[2];
    if (item != 'debug-overlay') return;
    event.preventDefault();
    console.log(offsetX + " " + offsetY);
    this.panel.element.style.left = (event.clientX + parseInt(offsetX,10)) + 'px';
    this.panel.element.style.top = (event.clientY + parseInt(offsetY,10)) + 'px';
    return false;

  }

  dragStart (event) {
    console.log("drag",event);
    let style = window.getComputedStyle(event.target);
    console.log(style);
    event.dataTransfer.setData("text/plain",(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ','
      + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ',' + 'debug-overlay');
    console.log(event.dataTransfer.getData("text/plain"));
  }*/

  destroy() {
    document.body.removeEventListener('mousemove',this.mouseMove);

    document.body.removeEventListener('mousedown',this.mouseUp);
    window.removeEventListener('mouseleave',this.mouseLeave);
    window.removeEventListener('blur',this.onBlur);
    super.destroy();
    if (this.panel) {
      this.panel.element.removeEventListener('mousedown',this.mouseDown);
      this.panel.destroy();
    }
  }


}
OverlayBar.bindFns = ["mouseUp","mouseMove","mouseDown","onBlur","mouseLeave"]
