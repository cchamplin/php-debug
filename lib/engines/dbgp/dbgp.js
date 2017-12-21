'use babel'
/** @jsx etch.dom */

import {parseString} from 'xml2js'
import Q from 'q'
import {Emitter, Disposable} from 'event-kit'

import DebugContext from '../../models/debug-context'
import Watchpoint from '../../models/watchpoint'
import DbgpInstance from './dbgp-instance'
import net from "net"
export default class Dbgp {
  constructor (params) {
    this.emitter = new Emitter()
    this.buffer = ''
    this.globalContext = params.context;
    this.serverPort = params.serverPort;
    this.serverAddress = params.serverAddress;
  }

  setPort (port) {
    if (port != this.serverPort) {
      this.serverPort = port
      if (this.listening()) {
        this.close()
        this.listen()
      }
    }
  }

  setAddress (address) {
    if (address != this.serverAddress) {
      this.serverAddress = address
      if (this.listening()) {
        this.close()
        this.listen()
      }
    }
  }
  setAddressPort (address,port) {
    if (port != this.serverPort || address != this.serverAddress) {
      this.serverPort = port
      this.serverAddress = address
      if (this.listening()) {
        this.close()
        this.listen()
      }
    }
  }
  listening () {
    return this.server != undefined;
  }

  running () {
    return this.socket && this.socket.readyState == 1
  }

  listen (options) {

    this.debugContext = new DebugContext()

    buffer = ''
    try {
      console.log("Attempting to setup server")
      if (this.listening()) {
        this.close()
      }
      this.server = net.createServer( (socket) => {
        socket.setEncoding('ascii');
        if (!this.globalContext.getCurrentDebugContext()) {
          this.globalContext.notifyConsoleMessage("Session initiated")
          console.log("Session initiated")
          instance = new DbgpInstance({socket:socket, context:this.globalContext})
        } else {
          this.globalContext.notifyConsoleMessage("New session rejected")
          console.log("New session rejected")
          socket.end()
        }
      });
      if (this.server) {
        this.server.on('error', (err) => {
          this.globalContext.notifyConsoleMessage( "Error: " + "Socket Error:", err)
          console.error("Socket Error:", err)
          atom.notifications.addWarning("Could not bind socket, do you already have an instance of the debugger open?")
          this.close()
          this.globalContext.notifySocketError()
          return false
        });
      }
      let serverOptions = {}
      serverOptions.port = this.serverPort
      if (this.serverAddress != "*") {
        serverOptions.host = this.serverAddress
      }
      if (this.server) {
        this.server.listen(serverOptions, () => {
          this.globalContext.notifyConsoleMessage("Listening on Address:Port " + this.serverAddress + ":" + this.serverPort)
          console.log("Listening on Address:Port " + this.serverAddress + ":" + this.serverPort)
        });
      }
      return true

    } catch (e) {
      this.globalContext.notifyConsoleMessage("Error: " + "Socket Error:", e)
      console.error("Socket Error:", e)
      atom.notifications.addWarning("Could not bind socket, do you already have an instance of the debugger open?")
      this.close()
      this.globalContext.notifySocketError()
      return false
    }
  }
  close (options) {
    if (this.globalContext.getCurrentDebugContext()) {
      this.globalContext.getCurrentDebugContext().stop()
    }
    if (this.socket) {
      this.socket.end()
      delete this.socket
    }
    if (this.server) {
      this.server.close()
      delete this.server
      this.globalContext.notifyConsoleMessage("Closed");
      console.log("closed")
    }
  }
}
