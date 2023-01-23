const path = require("path");
const {
  Seeder
} = require("mongo-seeding");

const config = {
  database: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PWD}@localhost:27017/${process.env.MONGODB_DB_NAME}?authSource=admin`,
  dropDatabase: true, // Drop database before import
};

console.log(`Connecting to: ${config.database}`);

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  path.resolve("./data"), {
    extensions: ["js"],
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
);

seeder
  .import(collections)
  .then(() => {
    console.log("Database seeded successfully!");
  })
  .catch((err) => {
    console.log("Error", err);
  });