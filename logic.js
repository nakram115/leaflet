// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(features, layer) {
    layer.bindPopup("<h3>" + features.properties.place +
      "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
  }
  function chooseColor(magnitude) {
    switch (magnitude) {
        case (features.properties.mag< 1):
            return "yellow";
        case (features.properties.mag> 1 && features.properties.mag < 2):
            return "red";
        case (features.properties.mag> 2 && features.properties.mag < 3):
            return "orange";
        case (features.properties.mag> 3 && features.properties.mag < 4):
            return "green";
        case (features.properties.mag> 4 &&  features.properties.mag < 5):
            return "purple";
        default:
            return "black";
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    fillColor: chooseColor(features.properties.mag),
});

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
 var streetmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
 	id: 'mapbox.streets',
 	accessToken: 'pk.eyJ1IjoibmFrcmFtMTE1IiwiYSI6ImNqaWR2Ym5peDAyNmgzcG1xeDVwcnIxYXcifQ.FaKZzXQlmEbjQs7q_Md-vA',
 	maxZoom: 18,
 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
 })
 var darkmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
 	id: 'mapbox.streets',
 	accessToken: 'pk.eyJ1IjoibmFrcmFtMTE1IiwiYSI6ImNqaWR2Ym5peDAyNmgzcG1xeDVwcnIxYXcifQ.FaKZzXQlmEbjQs7q_Md-vA',
 	maxZoom: 18,
 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
 })

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
    // create the tile layer that will be the background of our map
    var lightmap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      accessToken: 'pk.eyJ1IjoibmFrcmFtMTE1IiwiYSI6ImNqaWR2Ym5peDAyNmgzcG1xeDVwcnIxYXcifQ.FaKZzXQlmEbjQs7q_Md-vA',
      id: 'mapbox.streets',
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
