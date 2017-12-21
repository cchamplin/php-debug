'use babel'

import {serializeArray,deserializeArray, insertOrdered,arrayRemove} from '../helpers'
import {Emitter, Disposable} from 'event-kit'

export default class GlobalContext {
  constructor () {
    this.emitter = new Emitter()
    this.breakpoints = []
    this.watchpoints = []
    this.consoleMessages = []
    this.debugContexts = []

    this.onSessionEnd (() => {
      delete this.debugContexts[0]
      this.debugContexts = []
    });
  }
  serialize () {
    console.log('serializing');
    const result = {
      deserializer: 'GlobalContext',
      data: {
        version: this.constructor.version,
        breakpoints: serializeArray(this.getBreakpoints()),
        watchpoints: serializeArray(this.getWatchpoints())
      }
    }
    console.log(result);
    return result;
  }

  static deserialize (serialized) {
    const data = serialized.data;
    console.log('taco')
    console.log(data);
    const context = new GlobalContext()
    const breakpoints = deserializeArray(data.breakpoints)
    context.setBreakpoints(breakpoints)
    const watchpoints = deserializeArray(data.watchpoints)
    context.setWatchpoints(watchpoints)
    return context
  }

  addDebugEngine (engine) {
    this.engine = engine
  }

  getDebugEngine () {
    return this.engine
  }

  addBreakpoint (breakpoint) {
    insertOrdered(this.breakpoints, breakpoint)
    const data = {
      added: [breakpoint]
    }
    this.notifyBreakpointsChange(data)
  }

  removeBreakpoint (breakpoint) {
    removed = arrayRemove(this.breakpoints, breakpoint)
    if (removed) {
      const data = {
        removed: [removed]
      }
      this.notifyBreakpointsChange(data)
      return removed
    }
  }

  updateBreakpoint (breakpoint) {
    this.remoteBreakpoint(breakpoint)
    this.addBreakpoint(breakpoint)
  }

  setBreakpoints (breakpoints) {
    const removed = this.breakpoints
    this.breakpoints = breakpoints
    const data = {
      added: breakpoints,
      removed: removed
    }
    this.notifyBreakpointsChange(data)
  }

  setWatchpoints (watchpoints) {
    this.watchpoints = watchpoints
    const data = {
      added: watchpoints
    }
    this.notifyWatchpointsChange(data)
  }
  removeWatchpoint (watchpoint) {
    removed = arrayRemove(this.watchpoints, watchpoint)
    if (removed) {
      const data = {
        removed: [removed]
      }
      this.notifyWatchpointsChange(data)
      return removed
    }
  }
  getBreakpoints () {
    return this.breakpoints
  }

  addDebugContext (debugContext) {
    this.debugContexts.push(debugContext)
  }

  getCurrentDebugContext () {
    return this.debugContexts[0]
  }

  addWatchpoint (watchpoint) {
    insertOrdered(this.watchpoints, watchpoint)
    this.notifyWatchpointsChange()
  }

  getWatchpoints () {
    return this.watchpoints
  }

  addConsoleMessage (message) {
    this.consoleMessages.push(message)
    this.notifyConsoleMessage(message)
  }

  getConsoleMessages (idx) {
    const result = {
      lines: this.consoleMessages.slice(idx),
      total: this.consoleMessages.length
    }
    return result
  }

  nextConsoleCommand () {
    this.notifyNextConsoleCommand();
  }
  previousConsoleCommand () {
    this.notifyPreviousConsoleCommand();
  }
  clearConsoleMessages () {
    this.consoleMessages = []
    this.notifyConsoleMessagesCleared()
  }
  setContext (context) {
    this.context = context
  }

  getContext () {
    return this.context
  }
  clearContext  () {

  }

  onPreviousConsoleCommand (callback) {
    this.emitter.on('php-debug.previousConsoleCommand', callback)
  }
  notifyPreviousConsoleCommand () {
    this.emitter.emit('php-debug.previousConsoleCommand')
  }
  onNextConsoleCommand (callback) {
    this.emitter.on('php-debug.nextConsoleCommand', callback)
  }
  notifyNextConsoleCommand () {
    this.emitter.emit('php-debug.nextConsoleCommand')
  }
  onConsoleMessage (callback) {
    this.emitter.on('php-debug.consoleMessage', callback)
  }
  notifyConsoleMessage (data) {
    this.emitter.emit('php-debug.consoleMessage', data)
  }
  onConsoleMessagesCleared (callback) {
    this.emitter.on('php-debug.consoleMessagesCleared', callback)
  }
  notifyConsoleMessagesCleared (data) {
    this.emitter.emit('php-debug.consoleMessagesCleared', data)
  }
  onBreakpointsChange (callback) {
    this.emitter.on('php-debug.breakpointsChange', callback)
  }
  notifyBreakpointsChange (data) {
    this.emitter.emit('php-debug.breakpointsChange', data)
  }
  onWatchpointsChange (callback) {
    this.emitter.on('php-debug.watchpointsChange', callback)
  }
  notifyWatchpointsChange (data) {
    this.emitter.emit('php-debug.watchpointsChange', data)
  }
  onBreak (callback) {
    this.emitter.on('php-debug.break', callback)
  }
  notifyBreak (data) {
    this.emitter.emit('php-debug.break', data)
  }
  onContextUpdate (callback) {
    this.emitter.on('php-debug.contextUpdate', callback)
  }
  notifyContextUpdate (data) {
    this.emitter.emit('php-debug.contextUpdate', data)
  }
  onStackChange (callback) {
    this.emitter.on('php-debug.stackChange', callback)
  }
  notifyStackChange (data) {
    this.emitter.emit('php-debug.stackChange', data)
  }
  onSessionEnd (callback) {
    this.emitter.on('php-debug.sessionEnd', callback)
  }
  notifySessionEnd (data) {
    this.emitter.emit('php-debug.sessionEnd', data)
  }
  onSocketError (callback) {
    this.emitter.on('php-debug.socketError', callback)
  }
  notifySocketError (data) {
    this.emitter.emit('php-debug.socketError', data)
  }
  onSessionStart (callback) {
    this.emitter.on('php-debug.sessionStart', callback)
  }
  notifySessionStart (data) {
    this.emitter.emit('php-debug.sessionStart', data)
  }
  onRunning (callback) {
    this.emitter.on('php-debug.running', callback)
  }
  notifyRunning (data) {
    this.emitter.emit('php-debug.running', data)
  }
}
atom.deserializers.add(GlobalContext);
//GlobalContext.version = '1a'
