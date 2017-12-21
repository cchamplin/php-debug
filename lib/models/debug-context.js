'use babel'

import {getInsertIndex} from '../helpers'

export default class DebugContext {

  constructor () {
    this.scopeList = {}
    this.watchpointList = []
    this.stackFrameList = []
  }

  addScope (scopeId, name) {
    this.scopeList[scopeId] = { name: name, scopeId: scopeId, context: {} }
  }

  setScopeContext (scopeId, context) {
    this.scopeList[scopeId].context = context
  }
  addWatchpoint (watchpoint) {
    index = getInsertIndex(this.watchpointList, watchpoint)
    this.watchpointList.push(watchpoint)
  }

  clearWatchpoints () {
    this.watchpointList = []
  }

  getWatchpoints () {
    return this.watchpointList
  }

  setStack (stack) {
    this.stackFrameList = stack
  }
  getStack () {
    return this.stackFrameList
  }

  clear () {
    this.scopeList = {}
  }

  getScopes () {
    return this.scopeList
  }

  stop () {
  }
}
