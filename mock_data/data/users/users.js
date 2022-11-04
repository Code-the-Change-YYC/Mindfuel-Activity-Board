const dayjs = require("dayjs")
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const { _ } = require("lodash");

const { assetTypes } = require("../../raw_data/asset-types.json");
const { locations } = require("../../raw_data/ip-locations.json");

// Number of sample users to generate
const NUM_USERS = 100000;

// Chooses a weighted random value, used for determining wondervilleAsset vs wondervilleSession
const weighted_random = (items, weights) => {
  var i;

  for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return items[i];
};

const generateUsers = () => {
  let users = [];
  for (let id = 1; id <= NUM_USERS; id++) {
    let loc = _.sample(locations); // Get random element from list of sample locations
    let user = {
      type: weighted_random(["wondervilleAsset", "wondervilleSession"], [0.8, 0.2]),
      date: faker.date.between(dayjs().subtract(3, "month").format(), dayjs().add(1, "month").format()),
      ...loc
    }

    if (user.type === "wondervilleAsset") {
      let asset = _.sample(assetTypes);
      user.payload.asset = asset; // Get random element from list of sample asset types
      user.url = asset.url
      user.payload.rank = faker.datatype.number({min: 1, max: assetTypes.length})
    } else {
      // Omit IP if wondervilleSession type
      user.payload = _.omit(user.payload, ["ip"])
    }

    users.push(user);
  }
  return users;
};
module.exports = generateUsers();

// Uncomment lines below if you want to save sample data to a JSON file
// let dataObj = generateUsers();
// fs.writeFileSync("sample_data.json", JSON.stringify(dataObj, null, "\t"));
