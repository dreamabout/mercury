/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.tableEditor", function() {

  beforeEach(function() {
    fixture.load('mercury/table_editor.html');
    this.table = $('#table1');
    return this.cell = this.table.find('th, td').first();
  });

  describe("singleton method", function() {

    beforeEach(function() {
      return this.loadSpy = spyOn(window.Mercury.tableEditor, 'load').andCallFake(() => {});
    });

    it("calls load", function() {
      window.Mercury.tableEditor(this.table, this.cell);
      return expect(this.loadSpy.callCount).toEqual(1);
    });

    return it("returns the function object", function() {
      const ret = window.Mercury.tableEditor(this.table, this.cell);
      return expect(ret).toEqual(window.Mercury.tableEditor);
    });
  });


  describe("#load", function() {

    it("expects a table and a table cell", function() {
      window.Mercury.tableEditor(this.table, this.cell);
      expect(window.Mercury.tableEditor.table).toEqual(this.table);
      return expect(window.Mercury.tableEditor.cell).toEqual(this.cell);
    });

    it("accepts content that will be placed inside cells", function() {
      window.Mercury.tableEditor(this.table, this.cell, '<br/>');
      return expect(window.Mercury.tableEditor.cellContent).toEqual('<br/>');
    });

    it("sets row based on where the cell is", function() {
      window.Mercury.tableEditor(this.table, this.cell);
      return expect(window.Mercury.tableEditor.row.get(0)).toEqual(this.table.find('tr').get(0));
    });

    it("gets the column count", function() {
      window.Mercury.tableEditor(this.table, this.cell);
      return expect(window.Mercury.tableEditor.columnCount).toEqual(6);
    });

    return it("gets the row count", function() {
      window.Mercury.tableEditor(this.table, this.cell);
      return expect(window.Mercury.tableEditor.rowCount).toEqual(8);
    });
  });


  describe("#getColumnCount", () => it("gets the column count from the alpha row", function() {
    window.Mercury.tableEditor(this.table, this.cell);
    return expect(window.Mercury.tableEditor.columnCount).toEqual(6);
  }));


  describe("#getRowCount", () => it("gets the row count", function() {
    window.Mercury.tableEditor(this.table, this.cell);
    return expect(window.Mercury.tableEditor.rowCount).toEqual(8);
  }));


  describe("#cellIndexFor", () => it("gives the right index for different cells", function() {
    let cell = this.table.find('#row1 td:nth-child(1n)').get(0);
    expect(window.Mercury.tableEditor.cellIndexFor(cell)).toEqual(0);

    cell = this.table.find('#row2 th:nth-child(2n)').get(0);
    expect(window.Mercury.tableEditor.cellIndexFor(cell)).toEqual(1);

    cell = this.table.find('#row2 th:nth-child(6n)').get(0);
    expect(window.Mercury.tableEditor.cellIndexFor(cell)).toEqual(5);

    cell = this.table.find('#row3 td:nth-child(4n)').get(0);
    expect(window.Mercury.tableEditor.cellIndexFor(cell)).toEqual(5);

    cell = this.table.find('#row7 td:nth-child(2n)').get(0);
    return expect(window.Mercury.tableEditor.cellIndexFor(cell)).toEqual(2);
  }));


  describe("#cellSignatureFor", () => it("returns an object with cell information", function() {
    let cell = this.table.find('#row2 th:nth-child(3n)').get(0);
    let sig = window.Mercury.tableEditor.cellSignatureFor(cell);
    expect(sig.width).toEqual(1);
    expect(sig.height).toEqual(2);
    expect(sig.right).toEqual(3);

    cell = this.table.find('#row2 th:nth-child(5n)').get(0);
    sig = window.Mercury.tableEditor.cellSignatureFor(cell);
    expect(sig.width).toEqual(1);
    expect(sig.height).toEqual(4);
    expect(sig.right).toEqual(5);

    cell = this.table.find('#row7 td:nth-child(1n)').get(0);
    sig = window.Mercury.tableEditor.cellSignatureFor(cell);
    expect(sig.width).toEqual(2);
    expect(sig.height).toEqual(1);
    return expect(sig.right).toEqual(2);
  }));

  describe("#findCellByOptionsFor", function() {

    it("finds a matching cell in a specific row, based on right", function() {
      const row = this.table.find('#row2').get(0);
      const sig = window.Mercury.tableEditor.findCellByOptionsFor(row, { right: 5 });
      return expect(sig.cell.get(0)).toEqual(this.table.find('#row2 th:nth-child(5n)').get(0));
    });

    it("finds a cell based on left", function() {
      const row = this.table.find('#row5').get(0);
      const sig = window.Mercury.tableEditor.findCellByOptionsFor(row, { left: 5 });
      return expect(sig.cell.get(0)).toEqual(this.table.find('#row5 th:nth-child(5n)').get(0));
    });

    it("finds a cell based on left and width", function() {
      const row = this.table.find('#row7').get(0);
      const sig = window.Mercury.tableEditor.findCellByOptionsFor(row, { left: 2, width: 4 });
      return expect(sig.cell.get(0)).toEqual(this.table.find('#row7 td:nth-child(2n)').get(0));
    });

    return describe("when a cell isn't there", function() {

      beforeEach(function() {
        return this.row = this.table.find('#row3').get(0);
      });

      it("returns null", function() {
        const sig = window.Mercury.tableEditor.findCellByOptionsFor(this.row, { left: 2 });
        return expect(sig).toEqual(null);
      });

      return it("can force to an adjacent cell", function() {
        const sig = window.Mercury.tableEditor.findCellByOptionsFor(this.row, { left: 2, forceAdjacent: true });
        expect(sig.cell.get(0)).toEqual(this.table.find('#row3 td:nth-child(2n)').get(0));
        return expect(sig.direction).toEqual('after');
      });
    });
  });


  describe("#findCellByIntersectionFor", () => it("finds cells that intersect vertically, based on the signature of another cell", function() {
    const sig = window.Mercury.tableEditor.cellSignatureFor(this.table.find('#row6 td:nth-child(3n)'));
    const intersectingSig = window.Mercury.tableEditor.findCellByIntersectionFor(this.table.find('#row7'), sig);
    return expect(intersectingSig.cell.get(0)).toEqual(this.table.find('#row7 td:nth-child(2n)').get(0));
  }));


  describe("#columnsFor", () => it("returns the total number of cells and colspans for a given collection of cells", function() {
    return expect(window.Mercury.tableEditor.columnsFor(this.table.find('#row7 td'))).toEqual(6);
  }));


  describe("#colspanFor", function() {

    it("returns the colspan of a given cell", function() {
      const cell = this.table.find('#row7 td:nth-child(2n)');
      return expect(window.Mercury.tableEditor.colspanFor(cell)).toEqual(4);
    });

    return it("defaults to 1", function() {
      const cell = this.table.find('#row6 td:first-child');
      return expect(window.Mercury.tableEditor.colspanFor(cell)).toEqual(1);
    });
  });


  describe("#rowspanFor", function() {

    it("returns the rowspan of a given cell", function() {
      const cell = this.table.find('#row2 th:nth-child(5n)');
      return expect(window.Mercury.tableEditor.rowspanFor(cell)).toEqual(4);
    });

    return it("defaults to 1", function() {
      const cell = this.table.find('#row6 td:first-child');
      return expect(window.Mercury.tableEditor.rowspanFor(cell)).toEqual(1);
    });
  });


  describe("setColspanFor", function() {

    beforeEach(function() {
      return this.cell = this.table.find('#row2 th:first-child');
    });

    it("sets the colspan for a cell", function() {
      window.Mercury.tableEditor.setColspanFor(this.cell, 20);
      return expect(this.cell.attr('colspan')).toEqual('20');
    });

    return it("removes the attribute if it's 1", function() {
      window.Mercury.tableEditor.setColspanFor(this.cell, 1);
      return expect(this.cell.attr('colspan')).toEqual(undefined);
    });
  });


  return describe("setRowspanFor", function() {

    beforeEach(function() {
      return this.cell = this.table.find('#row2 th:first-child');
    });

    it("sets the rowspan for a cell", function() {
      window.Mercury.tableEditor.setRowspanFor(this.cell, 20);
      return expect(this.cell.attr('rowspan')).toEqual('20');
    });

    return it("removes the attribute if it's 1", function() {
      window.Mercury.tableEditor.setRowspanFor(this.cell, 1);
      return expect(this.cell.attr('rowspan')).toEqual(undefined);
    });
  });
});
