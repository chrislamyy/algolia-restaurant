const fs = require("fs");
const csv = require("csv-parser");
const jsonfile = require("jsonfile");

const JSON_FILE_PATH = "dataset/restaurants_list.json";
const CSV_FILE_PATH = "dataset/restaurants_info.csv";

// Read the JSON file
jsonfile.readFile(JSON_FILE_PATH, (err, restaurantsData) => {
  if (err) {
    console.error(err);
    return;
  }

  // Read and merge data from CSV file
  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv({ separator: ";" }))
    .on("data", (row) => {
      const matchingRestaurant = restaurantsData.find(
        (restaurant) => restaurant.objectID === parseInt(row.objectID)
      );
      if (matchingRestaurant) {
        Object.assign(matchingRestaurant, row);
      }
    })
    .on("end", () => {
      // Write merged data back to JSON file
      jsonfile.writeFile(
        "dataset/merged_restaurant_data.json",
        restaurantsData,
        { spaces: 2 },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Merged data saved to merged_restaurant_data.json");
        }
      );
    });
});
