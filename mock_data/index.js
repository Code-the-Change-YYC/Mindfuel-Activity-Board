const path = require("path");
const { Seeder } = require("mongo-seeding");

const config = {
  database: process.env.MONGODB_LOCAL_URI + "/wondervilleDev?authSource=admin",
  dropDatabase: true, // Drop database before import
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve("./data"),
  {
    extensions: ["js"],
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
);

seeder
  .import(collections)
  .then(() => {
    console.log("Success");
  })
  .catch((err) => {
    console.log("Error", err);
  });