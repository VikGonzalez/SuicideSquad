// Adding tile layer
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
}); //.addTo(myMap);

let grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});



let populationLayer = L.layerGroup()
let gdpLayer = L.layerGroup()

// Defining style for population marker
var populationIcon = L.icon({
  iconUrl: 'resources/Images/images/yellow_dot.svg.png',
  
  iconSize:     [10, 10], // size of the icon
  iconOpacity: 0.7
});

// Define population marker
for (let i = 0; i < worldjsonall.features.length; i++) {
  let country = Object.assign({}, worldjsonall.features[i])
  console.log(country)
  if (country.properties.Location !== "No data"){
    let marker = L.marker([country.properties.LAT,country.properties.LON],{icon: populationIcon}).bindPopup(`<h4>Country: ${country.properties.NAME}</h4> <hr> <p>Latest year of recorded data: ${country.properties.year}</p><h4>Population: ${country.properties.population}</h4>`)
    marker.addTo(populationLayer)
    
  }
}

// Defining style for gdp marker
var gdpIcon = L.icon({
  iconUrl: 'resources/Images/images/Basic_red_dot.png',
  
  iconSize:     [10, 10], // size of the icon
  iconOpacity: 0.7
});

// Define gdp marker
for (let i = 0; i < worldjsonall.features.length; i++) {
  let country = Object.assign({}, worldjsonall.features[i])
  console.log(country)
  if (country.properties.Location !== "No data"){
    let marker = L.marker([country.properties.LAT,country.properties.LON],{icon: gdpIcon}).bindPopup(`<h4>Country: ${country.properties.NAME}</h4> <hr> <p>Latest year of recorded data: ${country.properties.year}</p><h4>GDP PER CAPITA: ${country.properties.gdp_per_capita}</h4>`)
    marker.addTo(gdpLayer)
    
  }
}

// Creating map object
var myMap = L.map("world-map", {
  center: [20.866667, -1.566667],
  zoom: 1.5,
  layers: [dark, populationLayer]
});

// Only one base layer can be shown at a time
var baseMaps = {
  Dark: dark,
  Grayscale: grayscale
}

let overlayMaps = {
  Population: populationLayer,
  GDP: gdpLayer
}

L.control.layers(baseMaps, overlayMaps).addTo(myMap);



function getColor(rate) {
  return rate > 30 ? '#4d004b' :
    rate > 25 ? '#810f7c' :
      rate > 20 ? '#88419d' :
        rate > 15 ? '#8c6bb1' :
          rate > 10 ? '#8c96c6' :
            rate > 5 ? '#9ebcda' :
              rate > 0 ? '#bfd3e6' :
                rate === "No data" ? '#e0ecf4' :
                  '#f7fcfd';
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

L.geoJson(worldjsonall, { style: style }).addTo(myMap);

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


function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    // popup: addPopup

  });
  //layer.bindPopup(`<h4>Country: ${feature.properties.NAME}</h4> <hr> <p>Latest year of recorded data: ${feature.properties.year}</p><p>Population: ${feature.properties.population}</p>`)
}

let geojson = L.geoJson(worldjsonall, {
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
    '<b>' + props.NAME + '<hr>' + '<h4>Latest year of recorded data:</h4>' + props.year + '<h4>Suicide Rate:</h4>' + props.SuicideRate
    : 'Hover over a country');
};

info.addTo(myMap);


// Create legend

// https://gis.stackexchange.com/questions/141745/horizontal-legend-leaflet-js
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = ["No data", 0, 5, 10, 15, 20, 25, 30],
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











