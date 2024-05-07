const algoliasearch = require("algoliasearch");

// You need your Admin API key
var client = algoliasearch("YOUR_APPLICATION_ID", "YOUR_ADMIN_API_KEY");

// Get list of indexes
client
  .listIndices()
  .then(({ items }) => {
    // Loop through indexes and clear them
    items.forEach((index) => {
      const indexName = index.name;
      console.log("Clearing index:", indexName);
      client
        .initIndex(indexName)
        .clearObjects()
        .then(() => {
          console.log("Index cleared successfully");
        })
        .catch((error) => {
          console.error("Error clearing index:", error);
        });
    });
    console.log("All indexes cleared.");
  })
  .catch((error) => {
    console.error("Error fetching indexes:", error);
  });
