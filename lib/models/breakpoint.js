'use babel'
/** @jsx etch.dom */


import Codepoint from './codepoint'

export default class Breakpoint extends Codepoint {
  static getNextBreakpointId () {
    return Breakpoint.breakpointId++;
  }
  static getNextBreakpointSettingId () {
    return Breakpoint.breakpointSettingId++;
  }

  constructor (props)  {
    super(props)
    this.type = props.type;
    this.exception = props.exception;
    this.settings = props.settings;

    if (!this.type) {
      this.type =  Breakpoint.TYPE_LINE
    }
    this.id = Breakpoint.getNextBreakpointId()
  }

  serialize () {
    return {
      deserializer: 'Breakpoint',
      version: Breakpoint.version,
      data: {
        filepath: this.getPath(),
        line: this.getLine(),
        settings: JSON.stringify(this.getSettings())
      }
    }
  }

  static deserialize (serialized) {
    const data = serialized.data;
    return new Breakpoint({filePath: data.filepath, line: data.line, settings: Breakpoint.parseSettings(data.settings)})
  }

  static parseSettings (settings) {
    let parsedSettings = JSON.parse(settings)
    for (let type in parsedSettings) {
        let settings = parsedSettings[type]
        for (let idx = 0; idx < settings.length; idx++) {
          parsedSettings[type][idx].id = Breakpoint.getNextBreakpointSettingId()
        }
    }
    return parsedSettings
  }



  getId () {
    return this.id;
  }

  getSettings () {
    if (!this.settings) {
      this.settings = {}
    }
    return this.settings;
  }

  getSettingsValues (type) {
    if (!this.settings) {
      this.settings = {}
      return []
    }
    if (!this.settings[type]) {
      return []
    }
    return this.settings[type];
  }

  setSettingsValues (type,values) {
    if (!this.settings) {
      this.settings = {}
    }
    this.settings[type] = []
    for (value of values) {
      this.addSetting(type,value)
    }
  }

  addSetting (type,value) {
    if (!this.settings) {
      this.settings = {}
    }
    if (!this.settings[type]) {
      this.settings[type] = []
    }
    value.id =  Breakpoint.getNextBreakpointSettingId()
    this.settings[type].push(value)
    return value
  }

  removeSetting (setting) {
    if (!setting || !setting.id) {
      return
    }
    if (!this.settings) {
      return
    }
    for (let type in this.settings) {
      let settings = this.settings[type];
      for (let idx = 0; idx < settings.length; idx++) {
        if (settings[idx].id == setting.id) {
          this.settings[type].splice(idx,1)
          return
        }
      }
    }
  }

  getType () {
    return this.type
  }
  getException () {
    return this.exception
  }

  isLessThan (other) {
    if (!(other instanceof Breakpoint)) {
      return true
    }
    if (other.getPath() < this.getPath()) {
      return true
    }
    if (other.getLine() < this.getLine()) {
      return true
    }
    return false
  }
  isEqual (other) {
    if (!(other instanceof Breakpoint)) {
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
    if (!(other instanceof Breakpoint)) {
      return false
    }
    return !this.isLessThan(other) && !this.isEqual(other)
  }

}
Breakpoint.version = '1d'
Breakpoint.breakpointId = 1
Breakpoint.breakpointSettingId = 1
Breakpoint.TYPE_LINE = 'line'
Breakpoint.TYPE_EXCEPTION = 'exception'
atom.deserializers.add(Breakpoint);
