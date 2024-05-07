require("dotenv").config();
import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";
import { facetValueNamingAndOrder } from "./constants/constants";
import {
  starCountGroupingHelper,
  facetValueNameHelper,
  calculateStarsWidth,
} from "./helpers/facets";
import { showSpinner, hideSpinner } from "./helpers/spinner";

const applicationID = process.env.APPLICATION_ID;
const apiKey = process.env.API_KEY;
const indexName = process.env.INDEX_NAME;

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName, {
  disjunctiveFacets: ["food_type", "payment_options", "stars_count"],
});

helper.on("result", function (event) {
  searchCallback(event.results);
});

//UI Elements
var hitsEl = document.getElementById("hits");
var facetsEl = document.getElementById("facets");
var noResultsContainerEl = document.getElementById("no-results-container");
var statsEl = document.getElementById("stats");
var facetsHeaderEl = document.getElementById("facets-header");
var paginationEl = document.getElementById("pagination");

// Result event callback
function searchCallback(results) {
  if (results.hits.length === 0) {
    const noResultsMessage = `<div id="no-results-message" class="pt-3">
      <p>We didn't find any results for the search <em>${results.query}</em>.</p>
      <a href="#" id="clear-all">Clear search</a>
    </div>`;
    noResultsContainerEl.innerHTML = noResultsMessage;
    hitsEl.innerHTML = "";
    facetsEl.innerHTML = "";
    statsEl.innerHTML = "";
    facetsHeaderEl.innerHTML = "";
    paginationEl.innerHTML = "";
    return;
  }

  // Remove no results message if present
  const noResultsMessage = document.getElementById("no-results-message");
  if (noResultsMessage) {
    noResultsMessage.remove();
  }

  // Render hits and facets
  renderHits(hitsEl, results);
  renderFacetList(facetsEl, results);
  hideSpinner();
}

// Rendering functions
function renderHits(hitsEl, results) {
  // Display search stats
  const count = `${results.nbHits} results`;
  const statsHTML = `<p class="m-0">${count} found in ${
    results.processingTimeMS / 1000
  } seconds</p>`;

  const paginationClass =
    results.nbHits < results.hitsPerPage ? "disabled" : "";

  const paginationHTML = `<div class="d-grid gap-2 col-6 mx-auto"><button type="button" class="btn btn-outline-secondary ${paginationClass}" data-info="20">Show More</button></div>`;

  // Generate hit cards
  const hits = results.hits
    .map(
      (hit) => `
    <div class="card border-0 mb-4">
      <div class="row g-0">
        <div class="image-wrapper col-lg-4 col-xl-3">
          <img src="${hit.image_url}" class="img-fluid rounded" alt="...">
        </div>
        <div class="content-wrapper col-lg-8 col-xl-9">
          <div class="card-body">
            <h5 class="card-title">${hit.name}</h5>
            <div class="rating-wrapper d-flex column-gap-2">
              <p class="rating-value">${hit.stars_count}</p>
              <div class="stars-outer">
                <div class="stars-inner" style="width: ${calculateStarsWidth(
                  hit.stars_count
                )}"></div>
              </div>
              <p class="review-count text-body-secondary">(${
                hit.reviews_count
              })</p>
            </div>
            <p class="card-text"><small class="text-body-secondary">${
              hit.food_type
            } | ${hit.neighborhood} | ${hit.price_range}</small></p>
            <a href="${hit.reserve_url}" class="btn btn-primary">Book now</a>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Set attributes and inner HTML
  hitsEl.setAttribute("data-hits", results.nbHits);
  hitsEl.setAttribute("data-hits-page", results.hitsPerPage);
  statsEl.innerHTML = statsHTML;
  paginationEl.innerHTML = paginationHTML;
  hitsEl.innerHTML = hits;
}

function renderFacetList(facetsEl, results) {
  const modalFacetsEl = document.getElementById("facets-content");
  var hasRefinements = false;

  var orderedFacets = results.disjunctiveFacets.sort(
    (a, b) =>
      facetValueNamingAndOrder[a.name].position -
      facetValueNamingAndOrder[b.name].position
  );

  var facets = orderedFacets
    .map(function (facet) {
      var name = facet.name;
      var displayName = facetValueNameHelper(facet.name);
      var header = `<h6 class="card-title">${displayName}</h6>`;
      var facetValues = results.getFacetValues(name);
      var facetsValuesList;

      if (helper.hasRefinements(facet.name)) {
        hasRefinements = true;
      }

      if (name === "stars_count") {
        var groupedStarRatingsByWidth = starCountGroupingHelper(facetValues);
        facetsValuesList = groupedStarRatingsByWidth
          .map(function (group) {
            const values = group.items.map((item) => item.name).join(",");
            var facetValueClass = group.items.some((item) => item.isRefined)
              ? "active"
              : "";
            return `
                  <a class="facet-link list-group-item list-group-item-action list-group-item-light ${facetValueClass}" data-attribute="${facet.name}" data-value="${values}" href="#">
                      <div class="stars-outer">
                      <div class="stars-inner" style="width: ${group.width}"></div>
                      </div>
                  </a>
              `;
          })
          .join("");
      } else if (name === "payment_options") {
        facetsValuesList = facetValues
          .map(function (facetValue) {
            var facetValueClass = facetValue.isRefined ? "active" : "";
            var valueAndCount = `<a class="facet-link d-flex justify-content-between align-items-center list-group-item list-group-item-action list-group-item-light ${facetValueClass}" data-attribute="${facet.name}" data-value="${facetValue.name}" href="#">
                <span class="facet-name">${facetValue.name}</span>
                </a>`;

            return `${valueAndCount}`;
          })
          .join("");
      } else {
        facetsValuesList = facetValues
          .map(function (facetValue) {
            var facetValueClass = facetValue.isRefined ? "active" : "";
            var facetCountClass = facetValue.isRefined
              ? "text-bg-light"
              : "text-bg-secondary";
            var valueAndCount = `<a class="facet-link d-flex justify-content-between align-items-center list-group-item list-group-item-action list-group-item-light ${facetValueClass}" data-attribute="${facet.name}" data-value="${facetValue.name}" href="#">
                <span class="facet-name">${facetValue.name}</span>
                <span class="facet-count badge text-bg-primary rounded-pill ${facetCountClass}">${facetValue.count}</span>
                </a>`;

            return `${valueAndCount}`;
          })
          .join("");
      }
      return (
        header + `<ul class="pt-3 pb-3 list-group"> ${facetsValuesList} </ul>`
      );
    })
    .join("");

  facetsEl.innerHTML = facets;
  var facetHeaderClass = hasRefinements ? "" : "disabled";
  var facetsHeaderHTML = `<h5 class="mb-0">Filters & Sort</h5><button type="button" class="clear-all btn btn-sm btn-outline-secondary ${facetHeaderClass}">Clear all</button>`;
  facetsHeaderEl.innerHTML = facetsHeaderHTML;
  modalFacetsEl.innerHTML = facets;
}

// Event listeners
document.getElementById("search").addEventListener("keyup", function () {
  helper.setQuery(this.value).search();
});

document.addEventListener("click", function (event) {
  // pagination button
  const paginationButton = event.target.closest("#pagination button");
  // filter and sort clear all button
  const clearAllButton = event.target.closest("#facets-header button");
  // no search results clear all link
  const clearAllLink = event.target.closest("#clear-all");
  // facets list group item button
  const facetLink = event.target.closest(".facet-link");

  if (facetLink) {
    event.preventDefault();
    // Get the data attributes
    var dataAttribute = facetLink.getAttribute("data-attribute");
    var dataValue = facetLink.getAttribute("data-value");

    if (dataValue.includes(",")) {
      var facetValues = dataValue.split(",");
      if (facetLink.classList.contains("active")) {
        facetValues.forEach((value) => {
          helper.removeDisjunctiveFacetRefinement(dataAttribute, value);
        });
      } else {
        facetValues.forEach((value) => {
          helper.addDisjunctiveFacetRefinement(dataAttribute, value);
        });
      }
      helper.setQueryParameter("hitsPerPage", 20).search();
    } else {
      helper
        .setQueryParameter("hitsPerPage", 20)
        .toggleFacetRefinement(dataAttribute, dataValue)
        .search();
    }
  }

  if (paginationButton) {
    var hits = document.getElementById("hits");
    var hitsPerPage = parseInt(hits.getAttribute("data-hits-page"), 10);
    helper.setQueryParameter("hitsPerPage", hitsPerPage + 5).search();
  }

  if (clearAllButton) {
    helper.clearRefinements().search();
  }

  if (clearAllLink) {
    var searchBarEl = document.getElementById("search");
    searchBarEl.value = "";
    helper.setQuery("").search();
  }
});

// Check if geolocation is supported
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  showSpinner();
} else {
  console.log("Geolocation is not supported by this browser.");
  performFallbackSearch();
}

function successHandler(position) {
  const { latitude, longitude } = position.coords;
  const locationString = `${latitude},${longitude}`;
  setQueryParametersAndSearch(locationString);
}

function errorHandler(error) {
  console.log("Error in geolocation API:", error.message);
  performFallbackSearch();
}

// Set query parameters based on geolocation and trigger search
function setQueryParametersAndSearch(locationString) {
  helper.setQueryParameter("aroundLatLng", locationString);
  helper.setQueryParameter("aroundRadius", "all");
  helper.search();
}

// Fallback search in case geolocation fails or is unsupported
function performFallbackSearch() {
  console.log("Performing fallback search...");
  helper.search();
}
