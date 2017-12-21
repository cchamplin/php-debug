'use babel'

export default class Codepoint {

  constructor (props) {
    this.line = props.line;
    this.marker = props.marker;
    this.stackDepth = props.stackDepth;
    this.filePath = props.filePath;
    if (this.marker) {
      this.syncLineFromMarker()
    }
    if (!this.stackDepth) {
      this.stackdepth = -1
    }
  }

  getPath () {
    return this.filePath
  }

  getMarker() {
    return this.marker
  }

  getStackDepth () {
    return this.stackDepth
  }

  setMarker (marker) {
    if (this.marker) {
      this.marker.destroy()
    }
    this.marker = marker
  }

  syncLineFromMarker () {
    this.line = this.marker.getStartBufferPosition().row + 1
  }

  getLine () {
    if (this.marker) {
      return this.marker.getStartBufferPosition().row + 1
    }
    return this.line
  }

  isLessThan (other) {
    if (!(other instanceof Codepoint)) {
      return true
    }
    if (other.getPath() < this.getPath()) {
      return true
    }
    if (other.getLine() < this.getLine()) {
      return true
    }
  }

  isEqual (other) {
    if (!(other instanceof Codepoint)) {
      return false
    }
    if (other.getPath() != this.getPath()) {
      return false
    }
    if (other.getLine() != this.getLine()) {
      return false
    }
    return true
  }

  isGreaterThan (other) {
    if (!(other instanceof Codepoint)) {
      return false
    }
    return !this.isLessThan(other) && !this.isEqual(other)
  }
}
