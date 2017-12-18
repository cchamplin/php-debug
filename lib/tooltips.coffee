{ HoverTooltips } = require 'hover-tooltips';
{ Point } = require 'atom'


class ToolTipProvider extends HoverTooltips
  constructor: (@provide) ->
    super()
    @syntax = 'source.php'
    @provider = ({line,column}) =>
      point = new Point(line-1,column-1)
      @provide(point)
    @activate()

  @dispose: ->
    @deactivate

module.exports = ToolTipProvider
