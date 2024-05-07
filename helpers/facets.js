import { facetValueNamingAndOrder } from "../constants/constants";

// Helper / Util functions
export function starCountGroupingHelper(data) {
  const groupedData = {};

  // Group items by rounded width
  data.forEach((item) => {
    const roundedWidth = calculateStarsWidth(item.name);
    groupedData[roundedWidth] = groupedData[roundedWidth] || [];
    groupedData[roundedWidth].push(item);
  });

  // Convert grouped data into an array of objects
  const groupedArray = Object.keys(groupedData).map((key) => ({
    width: key,
    items: groupedData[key],
  }));

  return groupedArray;
}

export function facetValueNameHelper(facetName) {
  return facetValueNamingAndOrder.hasOwnProperty(facetName)
    ? facetValueNamingAndOrder[facetName].name
    : facetName;
}

export function calculateStarsWidth(starsCount) {
  const starPercentage = (starsCount / 5) * 100;
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

  return starPercentageRounded;
}
