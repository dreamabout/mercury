/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.modalHandlers.insertTable", function() {

  beforeEach(function() {
    fixture.load('mercury/modals/inserttable.html');
    this.modal = {
      element: $(fixture.el),
      hide() {}
    };
    return this.insertTable = $.extend(this.modal, window.Mercury.modalHandlers.insertTable);
  });

  describe("initializing", function() {

    beforeEach(function() {
      this.tableEditorSpy = spyOn(window.Mercury, 'tableEditor').andCallFake(() => {});
      return this.insertTable.initialize();
    });

    it("selects the first cell", () => expect($('#cell1').hasClass('selected')).toEqual(true));

    return it("sets the table editor up", function() {
      expect(this.tableEditorSpy.callCount).toEqual(1);
      expect(this.tableEditorSpy.argsForCall[0][0].get(0)).toEqual($('table').get(0));
      return expect(this.tableEditorSpy.argsForCall[0][1].get(0)).toEqual($('#cell1').get(0));
    });
  });

  describe("clicking on the cells", function() {

    beforeEach(function() {
      this.tableEditorSpy = spyOn(window.Mercury, 'tableEditor').andCallFake(() => {});
      return this.insertTable.initialize();
    });

    it("should unselect any selected cells", function() {
      jasmine.simulate.click($('#cell2').get(0));
      return expect($('#cell1').hasClass('selected')).toEqual(false);
    });

    it("selects the cell clicked on", function() {
      jasmine.simulate.click($('#cell2').get(0));
      return expect($('#cell2').hasClass('selected')).toEqual(true);
    });

    return it("sets the table editor to use the selected cell", function() {
      jasmine.simulate.click($('#cell2').get(0));
      expect(this.tableEditorSpy.callCount).toEqual(2);
      return expect(this.tableEditorSpy.argsForCall[1][1].get(0)).toEqual($('#cell2').get(0));
    });
  });


  describe("clicking on the action buttons", function() {

    beforeEach(function() {
      this.addRowBeforeSpy    = spyOn(window.Mercury.tableEditor, 'addRowBefore').andCallFake(() => {});
      this.addRowSpy          = spyOn(window.Mercury.tableEditor, 'addRow').andCallFake(() => {});
      this.removeRowSpy       = spyOn(window.Mercury.tableEditor, 'removeRow').andCallFake(() => {});
      this.addColumnBeforeSpy = spyOn(window.Mercury.tableEditor, 'addColumnBefore').andCallFake(() => {});
      this.addColumnSpy       = spyOn(window.Mercury.tableEditor, 'addColumn').andCallFake(() => {});
      this.removeColumnSpy    = spyOn(window.Mercury.tableEditor, 'removeColumn').andCallFake(() => {});
      this.increaseColspanSpy = spyOn(window.Mercury.tableEditor, 'increaseColspan').andCallFake(() => {});
      this.decreaseColspanSpy = spyOn(window.Mercury.tableEditor, 'decreaseColspan').andCallFake(() => {});
      this.increaseRowspanSpy = spyOn(window.Mercury.tableEditor, 'increaseRowspan').andCallFake(() => {});
      this.decreaseRowspanSpy = spyOn(window.Mercury.tableEditor, 'decreaseRowspan').andCallFake(() => {});
      return this.insertTable.initialize();
    });

    it("adds a row before the selected cell", function() {
      jasmine.simulate.click($('[data-action=addRowBefore]').get(0));
      return expect(this.addRowBeforeSpy.callCount).toEqual(1);
    });

    it("adds a row after the selected cell", function() {
      jasmine.simulate.click($('[data-action=addRow]').get(0));
      return expect(this.addRowSpy.callCount).toEqual(1);
    });

    it("deletes the row of the selected cell", function() {
      jasmine.simulate.click($('[data-action=removeRow]').get(0));
      return expect(this.removeRowSpy.callCount).toEqual(1);
    });

    it("adds a column before the selected cell", function() {
      jasmine.simulate.click($('[data-action=addColumnBefore]').get(0));
      return expect(this.addColumnBeforeSpy.callCount).toEqual(1);
    });

    it("adds a column after the selected cell", function() {
      jasmine.simulate.click($('[data-action=addColumn]').get(0));
      return expect(this.addColumnSpy.callCount).toEqual(1);
    });

    it("deletes the column of the selected cell", function() {
      jasmine.simulate.click($('[data-action=removeColumn]').get(0));
      return expect(this.removeColumnSpy.callCount).toEqual(1);
    });

    it("increases the colspan of the selected cell", function() {
      jasmine.simulate.click($('[data-action=increaseColspan]').get(0));
      return expect(this.increaseColspanSpy.callCount).toEqual(1);
    });

    it("decreases the colspan of the selected cell", function() {
      jasmine.simulate.click($('[data-action=decreaseColspan]').get(0));
      return expect(this.decreaseColspanSpy.callCount).toEqual(1);
    });

    it("increases the rowspan of the selected cell", function() {
      jasmine.simulate.click($('[data-action=increaseRowspan]').get(0));
      return expect(this.increaseRowspanSpy.callCount).toEqual(1);
    });

    return it("decreases the rowspan of the selected cell", function() {
      jasmine.simulate.click($('[data-action=decreaseRowspan]').get(0));
      return expect(this.decreaseRowspanSpy.callCount).toEqual(1);
    });
  });


  describe("changing the alignment", () => it("changes the alignment of the table", function() {}));


  describe("changing the border", function() {

    beforeEach(function() {
      return this.insertTable.initialize();
    });

    it("changes the border of the table", function() {
      $('#table_border').val('19');
      jasmine.simulate.keyup($('#table_border').get(0));
      return expect($('table').attr('border')).toEqual('19');
    });

    it("handles non-numeric values", function() {
      $('#table_border').attr({value: '2x'});
      // chrome already does this -- so only test in those browsers that will return 12x
      if ($('#table_border').val() !== '2x') { $('#table_border').attr({value: '2'}); }
      jasmine.simulate.keyup($('#table_border').get(0));
      return expect($('table').attr('border')).toEqual('2');
    });

    return it("removes the property if empty value specified", function() {
      $('#table_border').val('');
      jasmine.simulate.keyup($('#table_border').get(0));
      return expect($('table').attr('border')).toEqual(undefined);
    });
  });


  describe("changing the cellspacing", function() {

    beforeEach(function() {
      return this.insertTable.initialize();
    });

    it("changes the cellspacing of the table", function() {
      $('#table_spacing').val('5');
      jasmine.simulate.keyup($('#table_spacing').get(0));
      return expect($('table').attr('cellspacing')).toEqual('5');
    });

    it("handles non-numeric values", function() {
      $('#table_spacing').attr({value: '12x'});
      // chrome already does this -- so only test in those browsers that will return 12x
      if ($('#table_spacing').val() !== '12x') { $('#table_spacing').attr({value: '12'}); }
      jasmine.simulate.keyup($('#table_spacing').get(0));
      return expect($('table').attr('cellspacing')).toEqual('12');
    });

    return it("removes the property if empty value specified", function() {
      $('#table_spacing').val('');
      jasmine.simulate.keyup($('#table_spacing').get(0));
      return expect($('table').attr('cellspacing')).toEqual(undefined);
    });
  });


  return describe("submitting", function() {

    beforeEach(function() {
      return this.insertTable.initialize();
    });

    it("triggers an action", function() {
      const spy = spyOn(window.Mercury, 'trigger').andCallFake(() => {});
      jasmine.simulate.click($('input[type=submit]').get(0));
      expect(spy.callCount).toEqual(1);
      expect(spy.argsForCall[0][0]).toEqual('action');
      expect(spy.argsForCall[0][1]['action']).toEqual('insertTable');
      const value = spy.argsForCall[0][1]['value'];
      expect(value).toContain('border="1"');
      expect(value).toContain('cellspacing="0"');
      return expect(value).toContain('<td id="cell2"><br></td>');
    });

    return it("hides the modal", function() {
      const spy = spyOn(this.modal, 'hide').andCallFake(() => {});
      jasmine.simulate.click($('input[type=submit]').get(0));
      return expect(spy.callCount).toEqual(1);
    });
  });
});
