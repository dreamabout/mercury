/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.window.Mercury.modalHandlers.insertTable = {

  initialize() {
    this.table = this.element.find('#table_display table');

    this.table.on('click', event => this.onCellClick($(event.target)));

    this.element.find('#table_alignment').on('change', () => this.setTableAlignment());
    this.element.find('#table_border').on('keyup', () => this.setTableBorder());
    this.element.find('#table_spacing').on('keyup', () => this.setTableCellSpacing());
    this.element.find('[data-action]').on('click', event => {
      event.preventDefault();
      return this.onActionClick(jQuery(event.target).data('action'));
    });

    this.selectFirstCell();

    return this.element.find('form').on('submit', event => {
      event.preventDefault();
      this.submitForm();
      return this.hide();
    });
  },


  selectFirstCell() {
    const firstCell = this.table.find('td, th').first();
    firstCell.addClass('selected');
    return window.window.Mercury.tableEditor(this.table, firstCell, '&nbsp;');
  },


  onCellClick(cell) {
    this.cell = cell;
    this.table = this.cell.closest('table');
    this.table.find('.selected').removeAttr('class');
    this.cell.addClass('selected');
    return window.window.Mercury.tableEditor(this.table, this.cell, '&nbsp;');
  },


  onActionClick(action) {
    if (!action) { return; }
    return window.window.Mercury.tableEditor[action]();
  },


  setTableAlignment() {
    return this.table.attr({align: this.element.find('#table_alignment').val()});
  },

  setTableBorder() {
    const border = parseInt(this.element.find('#table_border').val(), 10);
    if (isNaN(border)) {
      return this.table.removeAttr('border');
    } else {
      return this.table.attr({border});
    }
  },

  setTableCellSpacing() {
    const cellspacing = parseInt(this.element.find('#table_spacing').val(), 10);
    if (isNaN(cellspacing)) {
      return this.table.removeAttr('cellspacing');
    } else {
      return this.table.attr({cellspacing});
    }
  },


  submitForm() {
    this.table.find('.selected').removeAttr('class');
    this.table.find('td, th').html('<br/>');

    const html = jQuery('<div>').html(this.table).html();
    const value = html.replace(/^\s+|\n/gm, '').replace(/(<\/.*?>|<table.*?>|<tbody>|<tr>)/g, '$1\n');

    return window.window.Mercury.trigger('action', {action: 'insertTable', value});
  }

};
