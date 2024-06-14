/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("window.Mercury.HistoryBuffer", function() {

  beforeEach(function() {
    return this.buffer = new window.Mercury.HistoryBuffer(5);
  });

  afterEach(function() {
    this.buffer = null;
    return delete(this.buffer);
  });

  describe("constructor", function() {

    it("accepts a max length", function() {
      return expect(this.buffer.maxLength).toEqual(5);
    });

    return it("initializes an empty stack", function() {
      expect(this.buffer.index).toEqual(0);
      return expect(this.buffer.stack).toEqual([]);
    });
  });


  describe("#push", function() {

    it("won't duplicate items if the content is the same", function() {
      this.buffer.push('1');
      expect(this.buffer.stack).toEqual(['1']);

      this.buffer.push('2<em class="mercury-marker"></em>');
      return expect(this.buffer.stack).toEqual(['1', '2<em class="mercury-marker"></em>']);
    });

    it("pushes onto the stack where it should", function() {
      this.buffer.push('1');
      this.buffer.push('2');
      expect(this.buffer.stack).toEqual(['1', '2']);

      this.buffer.index = 0;
      this.buffer.push('3');
      return expect(this.buffer.stack).toEqual(['1', '3']);
    });

    return it("keeps the number of items within the max length by dropping the oldest items", function() {
      this.buffer.push('1');
      this.buffer.push('2');
      this.buffer.push('3');
      this.buffer.push('4');
      this.buffer.push('5');
      expect(this.buffer.stack).toEqual(['1', '2', '3', '4', '5']);
      this.buffer.push('6');
      return expect(this.buffer.stack).toEqual(['2', '3', '4', '5', '6']);
    });
  });


  describe("#undo", function() {

    beforeEach(function() {
      this.buffer.push('1');
      return this.buffer.push('2');
    });

    it("returns the correct item", function() {
      return expect(this.buffer.undo()).toEqual('1');
    });

    return it("returns null if there are no more items to undo", function() {
      expect(this.buffer.undo()).toEqual('1');
      return expect(this.buffer.undo()).toEqual(null);
    });
  });


  return describe("#redo", function() {

    beforeEach(function() {
      this.buffer.push('1');
      return this.buffer.push('2');
    });

    it("returns the correct item", function() {
      this.buffer.undo();
      return expect(this.buffer.redo()).toEqual('2');
    });

    return it("returns null if there are no more items to redo", function() {
      this.buffer.undo();
      expect(this.buffer.redo()).toEqual('2');
      return expect(this.buffer.redo()).toEqual(null);
    });
  });
});
