{$, View} = require 'atom-space-pen-views'
module.exports =
class PhpDebugDebugView extends View
  @content: ->
    @div click: 'toggleDebugging', class: 'php-debug-debug-view-toggle', =>
      @span class: 'icon icon-bug'
      @text('PHP Debug')


  constructor: (statusBar, @phpDebug) ->
    super
    @tile = statusBar.addLeftTile(item: @element, priority: -100)

  toggleDebugging: ->
    @phpDebug.toggleDebugging()

  setActive: (active) ->
    if active
      @element.className = 'php-debug-debug-view-toggle active'
    else
      @element.className = 'php-debug-debug-view-toggle'

  destroy: ->
    @tile?.destroy?()
