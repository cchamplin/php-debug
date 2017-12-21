'use babel'
/** @jsx etch.dom */

export default class BreakpointMarker {
  constructor(editor, range, gutter) {
    var enableGutters, gutterMarker, lineMarker;
    this.editor = editor;
    this.range = range;
    this.gutter = gutter;
    this.markers = {};
    enableGutters = atom.config.get('php-debug.GutterBreakpointToggle');
    if (enableGutters && this.gutter) {
      gutterMarker = this.editor.markBufferRange(this.range, {
        invalidate: 'inside'
      });
      this.markers.gutter = gutterMarker;
    }
    lineMarker = this.editor.markBufferRange(this.range);
    this.markers.line = lineMarker;
  }

  decorate = function() {
    var item;
    item = document.createElement('span');
    item.className = "highlight php-debug-gutter php-debug-highlight";
    if (this.markers.gutter) {
      this.gutter.decorateMarker(this.markers.gutter, {
        "class": 'php-debug-gutter-marker',
        item: item
      });
    }
    if (this.markers.line) {
      return this.editor.decorateMarker(this.markers.line, {
        type: 'line-number',
        "class": 'php-debug-breakpoint'
      });
    }
  };

  destroy = function() {
    var marker, ref, results, type;
    ref = this.markers;
    results = [];
    for (type in ref) {
      marker = ref[type];
      results.push(marker != null ? marker.destroy() : void 0);
    }
    return results;
  };

  getStartBufferPosition = function() {
    var marker, ref, type;
    ref = this.markers;
    for (type in ref) {
      marker = ref[type];
      if (marker) {
        return marker.getStartBufferPosition();
      }
    }
  };
}
