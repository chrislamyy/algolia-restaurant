const algoliasearch = require("algoliasearch");

// You need your Admin API key
var client = algoliasearch("YOUR_APPLICATION_ID", "YOUR_ADMIN_API_KEY");

// Use async/await syntax
(async () => {
  // List all indices
  const indices = await client.listIndices();

  // Primary indices don't have a `primary` key
  const primaryIndices = indices.items.filter((index) => !index.primary);
  const replicaIndices = indices.items.filter((index) => index.primary);

  // Delete primary indices first
  client
    .multipleBatch(
      primaryIndices.map((index) => {
        return { indexName: index.name, action: "delete" };
      })
    )
    .wait();
  console.log("Deleted primary indices.");

  // Now, delete replica indices
  client.multipleBatch(
    replicaIndices.map((index) => {
      return { indexName: index.name, action: "delete" };
    })
  );
  console.log("Deleted replica indices.");
})();
