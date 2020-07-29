// Creating map object
var myMap = L.map("world-map", {
  center: [35.866667, -15.566667],
  zoom: 1.5,
  dragging: false,
  scrollWheelZoom: false,
  zoomControl: false
});

// Adding tile layer
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}).addTo(myMap);


// Load in GeoJson data
// var geoData = "world_map.geojson";
// let world_map = L.geoJson(worldjson).addTo(myMap)
// L.geoJson(worldjson).addTo(myMap)

// var geojson;

// d3.json(world_map, data => {
// console.log("All features",data.features);
// console.log("One feature",data.features[0]);

function getColor(rate) {
  return rate > 30 ? '#0c2c84' :
    rate > 25 ? '#225ea8' :
      rate > 20 ? '#1d91c0' :
        rate > 15 ? '#41b6c4' :
          rate > 10 ? '#7fcdbb' :
            rate > 5 ? '#c7e9b4' :
              rate > 0 ? '#ffffcc' :
                '#ffffcc';
} // END of getColor

function style(feature) {
  return {
    fillColor: getColor(feature.properties.SuicideRate),
    weight: 1,
    opacity: 4,
    color: 'white',
    dashArray: '1',
    fillOpacity: 1
  };
} // END function style (map stroke)

L.geoJson(worldjson, { style: style }).addTo(myMap);

function highlightFeature(e) {
  var layer = e.target;

  // var popupContent = `<h4>Country: ${feature.properties.Country}</h4> <hr> <p>Latest year of recorded data: ${feature.properties.year}</p><p>Suicide Rate: ${feature.properties.SuicideRate}</p>`;
  // layer.bindPopup(popupContent);

  layer.setStyle({
    weight: 2,
    color: '#0c2c84',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);

  info.update();
}

// function addPopup(feature, layer) {
//   var popupContent = `<h4>Country: ${feature.properties.Country}</h4> <hr> <p>Latest year of recorded data: ${feature.properties.year}</p><p>Suicide Rate: ${feature.properties.SuicideRate}</p>`;
//   layer.bindPopup(popupContent);

// }

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    // popup: addPopup

  });
  layer.bindPopup(`<h4>Country: ${feature.properties.Country}</h4> <hr> <p>Latest year of recorded data: ${feature.properties.year}</p><p>Population: ${feature.properties.poulation}</p>`)
}

let geojson = L.geoJson(worldjson, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(myMap); //END of geoJson

var info = L.control({ position: 'bottomleft' });

info.onAdd = function (myMap) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h4>Country:</h4>' + (props ?
    '<b>' + props.Country + '<hr>' + '<h4>Latest year of recorded data:</h4>' + props.year + '<h4>Suicide Rate:</h4>' + props.SuicideRate + '%'
    : 'Hover over a country');
};

info.addTo(myMap);


// Create legend

// https://gis.stackexchange.com/questions/141745/horizontal-legend-leaflet-js
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5, 10, 15, 20, 25, 30],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  // first loop for colored legend boxes
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<span style="background:' + getColor(grades[i] + 1) + '"></span> ';
  }

  // a line break
  div.innerHTML += '<br>';

  // second loop for text
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<label>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+') + '</label>';
  }
  return div;
};

legend.addTo(myMap);











