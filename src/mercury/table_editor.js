/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.tableEditor = function(table, cell, cellContent) {
  window.window.Mercury.tableEditor.load(table, cell, cellContent);
  return window.window.Mercury.tableEditor;
};

jQuery.extend(window.window.Mercury.tableEditor, {

  load(table, cell, cellContent) {
    this.table = table;
    this.cell = cell;
    if (cellContent == null) { cellContent = ''; }
    this.cellContent = cellContent;
    this.row = this.cell.parent('tr');
    this.columnCount = this.getColumnCount();
    return this.rowCount = this.getRowCount();
  },


  addColumnBefore() {
    return this.addColumn('before');
  },


  addColumnAfter() {
    return this.addColumn('after');
  },


  addColumn(position) {
    if (position == null) { position = 'after'; }
    const sig = this.cellSignatureFor(this.cell);

    return (() => {
      const result = [];
      const iterable = this.table.find('tr');
      for (let j = 0, i = j; j < iterable.length; j++, i = j) {
        var intersecting, matching;
        var row = iterable[i];
        var rowSpan = 1;
        var matchOptions = position === 'after' ? {right: sig.right} : {left: sig.left};
        if (matching = this.findCellByOptionsFor(row, matchOptions)) {
          var newCell = jQuery(`<${matching.cell.get(0).tagName}>`).html(this.cellContent);
          this.setRowspanFor(newCell, matching.height);
          if (position === 'before') { matching.cell.before(newCell); } else { matching.cell.after(newCell); }
          result.push(i += matching.height - 1);
        } else if (intersecting = this.findCellByIntersectionFor(row, sig)) {
          result.push(this.setColspanFor(intersecting.cell, intersecting.width + 1));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  },


  removeColumn() {
    let cell;
    const sig = this.cellSignatureFor(this.cell);
    if (sig.width > 1) { return; }

    const removing = [];
    const adjusting = [];
    const iterable = this.table.find('tr');
    for (let j = 0, i = j; j < iterable.length; j++, i = j) {
      var intersecting, matching;
      var row = iterable[i];
      if (matching = this.findCellByOptionsFor(row, {left: sig.left, width: sig.width})) {
        removing.push(matching.cell);
        i += matching.height - 1;
      } else if (intersecting = this.findCellByIntersectionFor(row, sig)) {
        adjusting.push(intersecting.cell);
      }
    }

    for (cell of Array.from(removing)) { jQuery(cell).remove(); }
    return (() => {
      const result = [];
      for (cell of Array.from(adjusting)) {         result.push(this.setColspanFor(cell, this.colspanFor(cell) - 1));
      }
      return result;
    })();
  },


  addRowBefore() {
    return this.addRow('before');
  },


  addRowAfter() {
    return this.addRow('after');
  },


  addRow(position) {
    let cell, newCell, rowspan;
    if (position == null) { position = 'after'; }
    const newRow = jQuery('<tr>');

    if (((rowspan = this.rowspanFor(this.cell)) > 1) && (position === 'after')) {
      this.row = jQuery(this.row.nextAll('tr')[rowspan - 2]);
    }

    let cellCount = 0;
    for (cell of Array.from(this.row.find('th, td'))) {
      var colspan = this.colspanFor(cell);
      newCell = jQuery(`<${cell.tagName}>`).html(this.cellContent);
      this.setColspanFor(newCell, colspan);
      cellCount += colspan;
      if (((rowspan = this.rowspanFor(cell)) > 1) && (position === 'after')) {
        this.setRowspanFor(cell, rowspan + 1);
        continue;
      }

      newRow.append(newCell);
    }

    if (cellCount < this.columnCount) {
      let rowCount = 0;
      for (var previousRow of Array.from(this.row.prevAll('tr'))) {
        rowCount += 1;
        for (cell of Array.from(jQuery(previousRow).find('td[rowspan], th[rowspan]'))) {
          rowspan = this.rowspanFor(cell);
          if (((rowspan - 1) >= rowCount) && (position === 'before')) {
            this.setRowspanFor(cell, rowspan + 1);
          } else if (((rowspan - 1) >= rowCount) && (position === 'after')) {
            if ((rowspan - 1) === rowCount) {
              newCell = jQuery(`<${cell.tagName}>`).html(this.cellContent);
              this.setColspanFor(newCell, this.colspanFor(cell));
              newRow.append(newCell);
            } else {
              this.setRowspanFor(cell, rowspan + 1);
            }
          }
        }
      }
    }

    if (position === 'before') { return this.row.before(newRow); } else { return this.row.after(newRow); }
  },


  removeRow() {
    // check to see that all cells have the same rowspan, and figure out the minimum rowspan
    let cell, rowspan;
    let rowspansMatch = true;
    let prevRowspan = 0;
    let minRowspan = 0;
    for (cell of Array.from(this.row.find('td, th'))) {
      rowspan = this.rowspanFor(cell);
      if (prevRowspan && (rowspan !== prevRowspan)) { rowspansMatch = false; }
      if ((rowspan < minRowspan) || !minRowspan) { minRowspan = rowspan; }
      prevRowspan = rowspan;
    }

    if (!rowspansMatch && (this.rowspanFor(this.cell) > minRowspan)) { return; }

    // remove any emtpy rows below
    if (minRowspan > 1) {
      for (let i = 0, end = minRowspan - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) { jQuery(this.row.nextAll('tr')[i]).remove(); }
    }

    // find and move down any cells that have a larger rowspan
    for (cell of Array.from(this.row.find('td[rowspan], th[rowspan]'))) {
      var match;
      var sig = this.cellSignatureFor(cell);
      if (sig.height === minRowspan) { continue; }
      if (match = this.findCellByOptionsFor(this.row.nextAll('tr')[minRowspan - 1], {left: sig.left, forceAdjacent: true})) {
        this.setRowspanFor(cell, this.rowspanFor(cell) - this.rowspanFor(this.cell));
        if (match.direction === 'before') { match.cell.before(jQuery(cell).clone()); } else { match.cell.after(jQuery(cell).clone()); }
      }
    }

    if (this.columnsFor(this.row.find('td, th')) < this.columnCount) {
      // move up rows looking for cells with rowspans that might intersect
      let rowsAbove = 0;
      for (var aboveRow of Array.from(this.row.prevAll('tr'))) {
        rowsAbove += 1;
        for (cell of Array.from(jQuery(aboveRow).find('td[rowspan], th[rowspan]'))) {
          // if the cell intersects with the row we're trying to calculate on, and it's index is less than where we've
          // gotten so far, add it
          rowspan = this.rowspanFor(cell);
          if (rowspan > rowsAbove) { this.setRowspanFor(cell, rowspan - this.rowspanFor(this.cell)); }
        }
      }
    }

    return this.row.remove();
  },


  increaseColspan() {
    const cell = this.cell.next('td, th');
    if (!cell.length) { return; }
    if (this.rowspanFor(cell) !== this.rowspanFor(this.cell)) { return; }
    if (this.cellIndexFor(cell) > (this.cellIndexFor(this.cell) + this.colspanFor(this.cell))) { return; }
    this.setColspanFor(this.cell, this.colspanFor(this.cell) + this.colspanFor(cell));
    return cell.remove();
  },


  decreaseColspan() {
    if (this.colspanFor(this.cell) === 1) { return; }
    this.setColspanFor(this.cell, this.colspanFor(this.cell) - 1);
    const newCell = jQuery(`<${this.cell.get(0).tagName}>`).html(this.cellContent);
    this.setRowspanFor(newCell, this.rowspanFor(this.cell));
    return this.cell.after(newCell);
  },


  increaseRowspan() {
    let match;
    const sig = this.cellSignatureFor(this.cell);
    const nextRow = this.row.nextAll('tr')[sig.height - 1];
    if (nextRow && (match = this.findCellByOptionsFor(nextRow, {left: sig.left, width: sig.width}))) {
      this.setRowspanFor(this.cell, sig.height + match.height);
      return match.cell.remove();
    }
  },

  decreaseRowspan() {
    let match;
    const sig = this.cellSignatureFor(this.cell);
    if (sig.height === 1) { return; }
    const nextRow = this.row.nextAll('tr')[sig.height - 2];
    if (match = this.findCellByOptionsFor(nextRow, {left: sig.left, forceAdjacent: true})) {
      const newCell = jQuery(`<${this.cell.get(0).tagName}>`).html(this.cellContent);
      this.setColspanFor(newCell, this.colspanFor(this.cell));
      this.setRowspanFor(this.cell, sig.height - 1);
      if (match.direction === 'before') { return match.cell.before(newCell); } else { return match.cell.after(newCell); }
    }
  },

  // Counts the columns of the first row (alpha row) in the table.  We can safely rely on the first row always being
  // comprised of a full set of cells or cells with colspans.
  getColumnCount() {
    return this.columnsFor(this.table.find('thead tr:first-child, tbody tr:first-child, tfoot tr:first-child').first().find('td, th'));
  },


  // Counts the rows of the table.
  getRowCount() {
    return this.table.find('tr').length;
  },


  // Gets the index for a given cell, taking into account that rows above it can have cells that have rowspans.
  cellIndexFor(cell) {
    cell = jQuery(cell);

    // get the row for the cell and calculate all the columns in it
    const row = cell.parent('tr');
    const columns = this.columnsFor(row.find('td, th'));
    let index = this.columnsFor(cell.prevAll('td, th'));

    // if the columns is less than expected, we need to look above for rowspans
    if (columns < this.columnCount) {
      // move up rows looking for cells with rowspans that might intersect
      let rowsAbove = 0;
      for (var aboveRow of Array.from(row.prevAll('tr'))) {
        rowsAbove += 1;
        for (var aboveCell of Array.from(jQuery(aboveRow).find('td[rowspan], th[rowspan]'))) {
          // if the cell intersects with the row we're trying to calculate on, and it's index is less than where we've
          // gotten so far, add it
          if ((this.rowspanFor(aboveCell) > rowsAbove) && (this.cellIndexFor(aboveCell) <= index)) {
            index += this.colspanFor(aboveCell);
          }
        }
      }
    }

    return index;
  },

  // Creates a signature for a given cell, which is made up if it's size, and itself.
  cellSignatureFor(cell) {
    const sig = {cell: jQuery(cell)};
    sig.left = this.cellIndexFor(cell);
    sig.width = this.colspanFor(cell);
    sig.height = this.rowspanFor(cell);
    sig.right = sig.left + sig.width;
    return sig;
  },

  // Find a cell based on options.  Options can be:
  // right
  // or
  // left, [width], [forceAdjacent]
  // eg. findCellByOptionsFor(@row, {left: 1, width: 2, forceAdjacent: true})
  findCellByOptionsFor(row, options) {
    let sig;
    for (var cell of Array.from(jQuery(row).find('td, th'))) {
      sig = this.cellSignatureFor(cell);
      if (typeof(options.right) !== 'undefined') {
        if (sig.right === options.right) { return sig; }
      }
      if (typeof(options.left) !== 'undefined') {

        if (options.width) {
          if ((sig.left === options.left) && (sig.width === options.width)) { return sig; }
        } else if (!options.forceAdjacent) {
          if (sig.left === options.left) { return sig; }
        } else if (options.forceAdjacent) {
          if (sig.left > options.left) {
            var prev = jQuery(cell).prev('td, th');
            if (prev.length) {
              sig = this.cellSignatureFor(prev);
              sig.direction = 'after';
            } else {
              sig.direction = 'before';
            }
            return sig;
          }
        }
      }
    }

    if (options.forceAdjacent) {
      sig.direction = 'after';
      return sig;
    }

    return null;
  },

  // Finds a cell that intersects with the current signature
  findCellByIntersectionFor(row, signature) {
    for (var cell of Array.from(jQuery(row).find('td, th'))) {
      var sig = this.cellSignatureFor(cell);
      if (((sig.right - signature.left) >= 0) && (sig.right > signature.left)) { return sig; }
    }
    return null;
  },


  // Counts all the columns in a given array of columns, taking colspans into
  // account.
  columnsFor(cells) {
    let count = 0;
    for (var cell of Array.from(cells)) { count += this.colspanFor(cell); }
    return count;
  },


  // Tries to get the colspan of a cell, falling back to 1 if there's none
  // specified.
  colspanFor(cell) {
    return parseInt(jQuery(cell).attr('colspan')) || 1;
  },


  // Tries to get the rowspan of a cell, falling back to 1 if there's none
  // specified.
  rowspanFor(cell) {
    return parseInt(jQuery(cell).attr('rowspan')) || 1;
  },


  // Sets the colspan of a cell, removing it if it's 1.
  setColspanFor(cell, value) {
    return jQuery(cell).attr('colspan', value > 1 ? value : null);
  },


  // Sets the rowspan of a cell, removing it if it's 1
  setRowspanFor(cell, value) {
    return jQuery(cell).attr('rowspan', value > 1 ? value : null);
  }
}
);
