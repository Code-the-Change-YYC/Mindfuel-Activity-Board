const { _ } = require("lodash");
const fs = require("fs");

const { assetTypes } = require("../../raw_data/asset-types.json");

const generateStats = () => {
  let stats = [];

  assetTypes.forEach((assetType) => {
    stats.push({
      name: assetType.name,
      url: assetType.url,
      type: assetType.type,
      imageUrl: assetType.imageUrl,
      hits: _.random(5000, 30000),
    });
  });

  return stats;
};
module.exports = generateStats();

// Uncomment lines below if you want to save sample stats to a JSON file
// let statsObj = generateStats();
// fs.writeFileSync("sample_stats.json", JSON.stringify(statsObj, null, "\t"));
