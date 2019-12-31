'use strict';

var Collection = require('../../src/js/core/collection');

describe('Collection', function() {
  var c;

  beforeEach(function() {
    c = new Collection();
  });

  describe('constructor()', function() {
    it('should customize a method that extracts ID from the item', function() {
      var col = new Collection(function(item) {
        return item.myID;
      });

      col.add({myID: 3});
      expect(col.items['3']).toEqual({myID: 3});
    });
  });

  describe('getItemID()', function() {
    it('should get ID from the item', function() {
      var item = {_id: 7};
      expect(c.getItemID(item)).toBe('7');
    });
  });

  describe('add()', function() {
    it('should add an item to the collection', function() {
      c.add({_id: 25});
      expect(c.length).toBe(1);
      expect(c.items['25']).toBeDefined();
    });

    it('should overwrite duplicated model', function() {
      c.add({_id: 25});
      c.add({_id: 25,
hello: 'world'});
      expect(c.items['25'].hello).toBe('world');
    });

    it('should add multiple items at once', function() {
      c.add({_id: 2}, {_id: 4});

      expect(c.length).toBe(2);
      expect(c.items).toEqual({
        '2': {_id: 2},
        '4': {_id: 4}
      });
    });
  });

  describe('remove()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {_id: 1};
      item2 = {_id: 2};
      item3 = {_id: 4};

      c.add(item1, item2, item3);
    });

    it('should not happen anything when collection is empty', function() {
      var col = new Collection();
      col.remove(2);
      expect(col.length).toBe(0);
    });

    it('should not remove an item that is not in the collection', function() {
      c.remove(3);
      expect(c.length).toBe(3);
    });

    it('should remove its own item', function() {
      expect(c.remove(2)).toBe(item2);
      expect(c.length).toBe(2);
    });

    it('should remove multiple items at once', function() {
      expect(c.remove(1, 2)).toEqual([item1, item2]);
      expect(c.length).toBe(1);
    });

    it('should remove an item by passing an instance itself', function() {
      c.remove(item1, item2);
      expect(c.length).toBe(1);
      expect(c.items['4']).toBe(item3);
      expect(c.items['2']).toBeUndefined();
    });
  });

  describe('clear()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {_id: 1};
      item2 = {_id: 2};
      item3 = {_id: 4};

      c.add(item1, item2, item3);
    });

    it('should not happen anything when collection is empty', function() {
      var col = new Collection();
      col.clear();
      expect(col.length).toBe(0);
    });

    it('should remove all of collection items', function() {
      c.clear();
      expect(c.length).toBe(0);
      expect(c.items).toEqual({});
    });
  });

  describe('has()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {_id: 1};
      item2 = {_id: 2};
      item3 = {_id: 4};

      c.add(item1, item2, item3);
    });

    it('should not happen anything when collection is empty', function() {
      var col = new Collection();
      expect(col.has(item1)).toBe(false);
    });

    it('should return true when collection has the object', function() {
      expect(c.has(item1)).toBe(true);
      expect(c.has({})).toBe(false);
    });

    it('should check whether item exists or not by its id', function() {
      expect(c.has(2)).toBe(true);
      expect(c.has(14)).toBe(false);
    });

    it('should use the filter function instead of id', function() {
      var callCount = 0;

      expect(
        c.has(function(item) {
          callCount += 1;

          return item._id === 2;
        })
      ).toBe(true);

      expect(callCount).toBe(2);

      expect(
        c.has(function(item) {
          return item.name === '123';
        })
      ).toBe(false);
    });
  });

  describe('find()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20
      };
      item2 = {
        _id: 2,
        value: 50
      };
      item3 = {
        _id: 4,
        value: 2
      };

      c.add(item1, item2, item3);
    });

    it('should return new collection that filled with filtered items', function() {
      var filtered = c.find(function(item) {
        return item.value >= 20;
      });

      expect(filtered.length).toBe(2);
    });

    it('should return the collection that has same customized getItemID function', function() {
      var cust = function(item) {
        return item.ID;
      };
      var col = new Collection(cust);
      var filtered;

      col.add({ID: 3});

      filtered = col.find(function(item) {
        return item.ID === 3;
      });

      expect(filtered.getItemID === cust).toBe(true);
    });
  });

  describe('Collection.and()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20
      };
      item2 = {
        _id: 2,
        value: 50
      };
      item3 = {
        _id: 4,
        value: 2
      };

      c.add(item1, item2, item3);
    });

    it('should combind multiple filter functions with AND clause', function() {
      var combinedFilter, result, expected;

      function filter1(item) {
        return item._id === 2;
      }

      function filter2(item) {
        return item.value === 50;
      }

      function filter3(item) {
        return item.label === '';
      }

      combinedFilter = Collection.and(filter1, filter2);
      result = c.find(combinedFilter);

      expected = new Collection();
      expected.add(item2);
      expect(result).toEqual(expected);

      result = c.find(Collection.and(filter1, filter2, filter3));
      expect(result.length).toBe(0);

      expect(c.find(combinedFilter).length).toBe(1);
    });
  });

  describe('Collection.or()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20
      };
      item2 = {
        _id: 2,
        value: 50
      };
      item3 = {
        _id: 4,
        value: 2
      };

      c.add(item1, item2, item3);
    });

    it('should combine multiple filter functions with OR clause', function() {
      var combined, result;

      function filter1(item) {
        return item._id === 2;
      }

      function filter2(item) {
        return item.value === 2;
      }

      combined = Collection.or(filter1, filter2);
      result = c.find(combined);

      expect(result.length).toBe(2);
      expect(result.has(1)).toBe(false);

      expect(
        c.find(function(model) {
          return model._id === 2 || model.value === 2;
        })
      ).toEqual(result);
    });
  });

  describe('groupBy()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20,
        isGood: false,
        '30': 'a',
        'true': 'c',
        no: function() {
          return this.value;
        }
      };
      item2 = {
        _id: 2,
        value: 50,
        isGood: true,
        '30': 'b',
        'true': 'c',
        no: function() {
          return this.value;
        }
      };
      item3 = {
        _id: 4,
        value: 2,
        isGood: true,
        '30': 'b',
        'true': 'd',
        no: function() {
          return this.value;
        }
      };

      c.add(item1, item2, item3);
    });

    it('should group all elements by number values', function() {
      var grouped = c.groupBy('value');
      var c1, c2, c3;

      c1 = new Collection(c.getItemID);
      c1.add(item1);
      c2 = new Collection(c.getItemID);
      c2.add(item2);
      c3 = new Collection(c.getItemID);
      c3.add(item3);

      expect(grouped).toEqual({
        '20': c1,
        '50': c2,
        '2': c3
      });
    });

    it('should group by number property', function() {
      var grouped = c.groupBy(30);
      var c1, c2;

      c1 = new Collection(c.getItemID);
      Collection.prototype.add.apply(c1, [item1]);
      c2 = new Collection(c.getItemID);
      Collection.prototype.add.apply(c2, [item2, item3]);

      expect(grouped.a).toEqual(c1);
      expect(grouped.b).toEqual(c2);
    });

    it('should group by boolean values', function() {
      var grouped = c.groupBy('isGood');
      var c1, c2;

      c1 = new Collection(c.getItemID);
      c1.add(item1);
      c2 = new Collection(c.getItemID);
      c2.add(item2, item3);

      expect(grouped).toEqual({
        'false': c1,
        'true': c2
      });
    });

    it('should use returned value if base value is function', function() {
      var grouped = c.groupBy('no');
      var c1, c2, c3;

      c1 = new Collection(c.getItemID);
      c1.add(item1);
      c2 = new Collection(c.getItemID);
      c2.add(item2);
      c3 = new Collection(c.getItemID);
      c3.add(item3);

      expect(grouped).toEqual({
        '20': c1,
        '50': c2,
        '2': c3
      });
    });

    it('should group by custom functions', function() {
      var grouped = c.groupBy(function(item) {
        return item.value > 10 ? 'upper' : 'lower';
      });
      var c1, c2;

      c1 = new Collection(c.getItemID);
      Collection.prototype.add.apply(c1, [item1, item2]);
      c2 = new Collection(c.getItemID);
      Collection.prototype.add.apply(c2, [item3]);

      expect(grouped.upper).toEqual(c1);
      expect(grouped.lower).toEqual(c2);
    });

    it('should create each collection with keys when array of key values supplied by first arguments', function() {
      var grouped = c.groupBy(['20', '50']);
      var c1, c2, c3;

      expect(grouped['20'].constructor).toBe(Collection);
      expect(grouped['50'].constructor).toBe(Collection);

      // can supply group function after key array.
      grouped = c.groupBy(['20', '50'], function(item) {
        return item.value + '';
      });

      c1 = new Collection(c.getItemID);
      c1.add(item1);
      c2 = new Collection(c.getItemID);
      c2.add(item2);
      c3 = new Collection(c.getItemID);
      c3.add(item3);
      expect(grouped).toEqual({
        '20': c1,
        '50': c2,
        '2': c3
      });
    });
  });

  describe('sort()', function() {
    var item1, item2, item3;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20
      };
      item2 = {
        _id: 2,
        value: 50
      };
      item3 = {
        _id: 4,
        value: 2
      };

      c.add(item1, item2, item3);
    });

    it('should not happen anything when compareFunction not supplied', function() {
      var arr = c.sort();

      expect(arr).toEqual([item1, item2, item3]);
    });

    it('should sort its own items by given compare function', function() {
      var arr = c.sort(function(a, b) {
        if (a.value < b.value) {
          return -1;
        }

        if (a.value === b.value) {
          return 0;
        }

        return 1;
      });

      expect(arr[0]).toBe(item3);
      expect(arr[1]).toBe(item1);
      expect(arr[2]).toBe(item2);
    });
  });

  describe('each()', function() {
    var item1, item2, item3, spy;

    beforeEach(function() {
      item1 = {
        _id: 1,
        value: 20
      };
      item2 = {
        _id: 2,
        value: 50
      };
      item3 = {
        _id: 4,
        value: 2
      };

      c.add(item1, item2, item3);

      spy = jasmine.createSpy('each');
    });

    it('should iterate own items', function() {
      c.each(spy);

      expect(spy.calls.argsFor(2)).toEqual(
        jasmine.arrayContaining([{
          _id: 4,
          value: 2
        }, '4']));
      });

    it('should break loop when iteratee returns false', function() {
      spy.and.callFake(function(item) {
        if (item.value === 50) {
          return false;
        }
      });

      c.each(spy);

      expect(spy.calls.count()).toBe(2);
      expect(spy.calls.argsFor(2)).toEqual([]);
    });
  });

  describe('doWhenHas()', function() {
    it('should invoke the supplied method when collection has model', function() {
      var item1 = {_id: 1};
      var spy1 = jasmine.createSpy('spy1');
      var spy2 = jasmine.createSpy('spy2');

      c.add(item1);

      c.doWhenHas(1, spy1);
      c.doWhenHas(2, spy2);

      expect(spy1).toHaveBeenCalledWith(item1);
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe('single()', function() {
    it('should return single element in collection', function() {
      var item1 = {_id: 1},
        item2 = {_id: 2},
        item3 = {_id: 5};

      c.add(item3, item2, item1);

      expect([item1, item2, item3]).toContain(c.single());
    });
  });

  describe('merge()', function() {
    it('should return new collection with merged supplied collections', function() {
      var item1 = {_id: 1},
        item2 = {_id: 2},
        item3 = {_id: 5},
        c2 = new Collection();
      var merged;

      c.add(item1);
      c2.add(item2, item3);

      merged = Collection.merge(c, c2);
      expect(merged.length).toBe(3);
      expect(merged.items).toEqual({
        1: item1,
        2: item2,
        5: item3
      });
    });

    it('should newly create collection has same getItemIDFn with first argumented collection', function() {
      var item1 = {_id: 1},
        item2 = {_id: 2},
        item3 = {_id: 5},
        c2 = new Collection();
      var merged;

      c.add(item1);
      c2.add(item2, item3);

      merged = Collection.merge(c, c2);

      expect(merged.getItemID).toBe(c.getItemID);
    });

    it('should not affect total item counts with item that has same id', function() {
      var item1 = {_id: 1},
        item2 = {_id: 2},
        item3 = {_id: 5},
        item4 = {
          _id: 1,
          hello: 'world'
        },
        item5 = {_id: 2},
        item6 = {_id: 5},
        c2 = new Collection();
      var merged;

      c.add(item1, item2, item3);
      c2.add(item4, item5, item6);

      merged = Collection.merge(c, c2);

      expect(merged.length).toBe(3);
      expect(merged.items['1']).toEqual({
        _id: 1,
        hello: 'world'
      });
    });
  });

  describe('toArray()', function() {
    it('should return new array with collection items', function() {
      var item1 = {_id: 1},
        item2 = {_id: 2},
        item3 = {_id: 5};

      c.add(item1, item2, item3);
      expect(c.toArray()).toEqual([item1, item2, item3]);
    });
  });
});
