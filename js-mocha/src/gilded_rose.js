class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }
  updateQuality() {
    return this.items.map((item) => {
      // default quality degrades by 1
      let qualityChange = -1;
      switch (item.name) {
        // legendary items don't change sellIn and quality, return immediately
        case "Sulfuras, Hand of Ragnaros":
          return item;
        case "Aged Brie":
          qualityChange = 1;
          break;
        default:
          if (item.sellIn <= 0) qualityChange = -2;
          // backstage passes change quality depending on sellIn
          if (item.name.startsWith("Backstage passes")) {
            if (item.sellIn > 10) qualityChange = 1;
            if (item.sellIn <= 10 && item.sellIn > 3) qualityChange = 2;
            if (item.sellIn >= 0 && item.sellIn <= 3) qualityChange = 3;
            if (item.sellIn <= 0) qualityChange = -item.quality;
          }
          if (item.name.startsWith("Conjured")) {
            qualityChange = qualityChange * 2;
          }
          break;
      }

      item.sellIn--;
      item.quality += qualityChange;
      // items quality must be between 0 and 50 (excluding legendary items, short circuit returned before)
      if (item.quality < 0) item.quality = 0;
      if (item.quality > 50) item.quality = 50;
      return item;
    });
  }

  updateQualityReference() {
    for (var i = 0; i < this.items.length; i++) {
      if (
        this.items[i].name != "Aged Brie" &&
        this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
      ) {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
            this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
          if (
            this.items[i].name == "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
          }
        }
      }
      if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != "Aged Brie") {
          if (
            this.items[i].name != "Backstage passes to a TAFKAL80ETC concert"
          ) {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != "Sulfuras, Hand of Ragnaros") {
                this.items[i].quality = this.items[i].quality - 1;
              }
            }
          } else {
            this.items[i].quality =
              this.items[i].quality - this.items[i].quality;
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
    }

    return this.items;
  }
}
module.exports = {
  Item,
  Shop,
};
