/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.HistoryBuffer = class HistoryBuffer {

  constructor(maxLength) {
    if (maxLength == null) { maxLength = 200; }
    this.maxLength = maxLength;
    this.index = 0;
    this.stack = [];
    this.markerRegExp = /<em class="mercury-marker"><\/em>/g;
  }


  push(item) {
    if (jQuery.type(item) === 'string') {
      if (this.stack[this.index] && (this.stack[this.index].replace(this.markerRegExp, '') === item.replace(this.markerRegExp, ''))) { return; }
    } else if ((jQuery.type(item) === 'object') && item.html) {
      if (this.stack[this.index] && (this.stack[this.index].html === item.html)) { return; }
    }

    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(item);
    if (this.stack.length > this.maxLength) { this.stack.shift(); }
    return this.index = this.stack.length - 1;
  }


  undo() {
    if (this.index < 1) { return null; }
    this.index -= 1;
    return this.stack[this.index];
  }


  redo() {
    if (this.index >= (this.stack.length - 1)) { return null; }
    this.index += 1;
    return this.stack[this.index];
  }
};
