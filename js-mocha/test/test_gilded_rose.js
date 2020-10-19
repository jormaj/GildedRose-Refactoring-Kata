var { expect } = require("chai");
var { Shop, Item } = require("../src/gilded_rose.js");

// const items = [
//   new Item("+5 Dexterity Vest", 10, 20),
//   new Item("Aged Brie", 2, 0),
//   new Item("Elixir of the Mongoose", 5, 7),
//   new Item("Sulfuras, Hand of Ragnaros", 0, 80),
//   new Item("Sulfuras, Hand of Ragnaros", -1, 80),
//   new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
//   new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
//   new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),

//   // This Conjured item does not work properly yet
//   new Item("Conjured Mana Cake", 3, 6),
// ];

function assertGeneralCriteria(itemName, itemSellIn, itemQuality) {
  describe(`Gilded Rose - general item criteria (${itemName})`, function () {
    let shop = new Shop([new Item(itemName, itemSellIn, itemQuality)]);
    let items = shop.updateQuality();

    it("item name should not change", function () {
      expect(items[0].name).to.equal(itemName);
    });

    it("item can not degrade below 0", function () {
      expect(items[0].quality).to.be.at.least(0);
    });

    it("item quality can not exceed 50", function () {
      expect(items[0].quality).to.be.at.most(50);
    });
  });
}

function assertSellInChanges(itemName, itemSellIn, itemQuality) {
  describe(`Gilded Rose - all except legendary criteria (${itemName})`, function () {
    let shop = new Shop([new Item(itemName, itemSellIn, itemQuality)]);
    let items = shop.updateQuality();
    it("item should be sold a day sooner", function () {
      expect(items[0].sellIn).to.equal(itemSellIn - 1);
    });
  });
}

assertGeneralCriteria("+5 Dexterity Vest", 1, 1);
assertSellInChanges("+5 Dexterity Vest", 1, 1);
assertGeneralCriteria("+5 Dexterity Vest", 0, 0);
assertSellInChanges("+5 Dexterity Vest", 0, 0);

describe("Gilded Rose - generic item criteria (+5 Dexterity Vest)", function () {
  it("item should degrade before sellIn date", function () {
    let shop = new Shop([new Item("+5 Dexterity Vest", 1, 1)]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(0);
  });
  it("item should degrade twice as fast after sellIn date", function () {
    let shop = new Shop([new Item("+5 Dexterity Vest", 0, 2)]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(0);
  });
});

assertGeneralCriteria("Aged Brie", 1, 50);
assertGeneralCriteria("Aged Brie", 10, 10);
assertSellInChanges("Aged Brie", 10, 10);

describe("Gilded Rose - Aged Brie item criteria", function () {
  it("Aged Brie should increase in quality", function () {
    let shop = new Shop([new Item("Aged Brie", 1, 1)]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(2);
  });
});

assertGeneralCriteria("Sulfuras, Hand of Ragnaros", 0, 50);

describe("Gilded Rose - Sulfuras, Hand of Ragnaros item criteria", function () {
  let shop = new Shop([new Item("Sulfuras, Hand of Ragnaros", 1, 1)]);
  let items = shop.updateQuality();
  it("Sulfuras, Hand of Ragnaros quality does not change", function () {
    expect(items[0].quality).to.equal(1);
  });

  it("Sulfuras, Hand of Ragnaros sellIn does not change", function () {
    expect(items[0].sellIn).to.equal(1);
  });
});

assertGeneralCriteria("Backstage passes to a TAFKAL80ETC concert", 10, 10);
assertSellInChanges("Backstage passes to a TAFKAL80ETC concert", 10, 10);

describe("Gilded Rose - Backstage passes criteria", function () {
  it("Backstage pass quality increases by 2 when sellIn date between 10 and 3", function () {
    let shop = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 8, 10),
    ]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(12);
  });

  it("Backstage pass quality increases by 3 when sellIn date between 3 and 0", function () {
    let shop = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 1, 10),
    ]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(13);
  });

  it("Backstage pass quality is 0 after sellIn date", function () {
    let shop = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 10),
    ]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(0);
  });
});

assertGeneralCriteria("Conjured Mana Cake", 10, 10);
assertGeneralCriteria("Conjured Mana Cake", 0, 0);
assertSellInChanges("Conjured Mana Cake", 10, 10);
assertSellInChanges("Conjured Mana Cake", 0, 0);

describe("Gilded Rose - Conjured item criteria", function () {
  it("item should degrade by 2 before sellIn date", function () {
    let shop = new Shop([new Item("Conjured Mana Cake", 1, 10)]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(8);
  });
  it("item should degrade by 4 after sellIn date", function () {
    let shop = new Shop([new Item("Conjured Mana Cake", 0, 10)]);
    let items = shop.updateQuality();
    expect(items[0].quality).to.equal(6);
  });
});
