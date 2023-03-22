/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/


/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
//Define access token
mapboxgl.accessToken = 'pk.eyJ1Ijoid2FuYXNhaWZ1bCIsImEiOiJjbGR3MGtieDUwMnN6M3JuaGhpYzBwNzN4In0.6rML26l6faKftQC9-b7_PQ'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

//Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', //container id in HTML
    style: 'mapbox://styles/mapbox/dark-v11',  //
    center: [-79.390, 43.663],  // starting point, longitude/latitude
    zoom: 11 // starting zoom level
});

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

//Create geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

//Use geocoder div to position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

//Add event listeneer which returns map view to full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.390, 43.663],
        zoom: 11,
        essential: true
    });
});

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/

//Create an empty variable
let pedcycgeojson;
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable
fetch('https://raw.githubusercontent.com/wanasaiful/LAB4/main/data/pedcyc_collision_06-21.geojson')
.then(response => response.json())
.then(response => {
    console.log(response); //Check response in console
    pedcycgeojson = response; // Store geojson as variable using URL from fetch response
});

/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler
//      First create a bounding box around the collision point data then store as a feature collection variable
//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function

map.on('load', ()=> {

let bboxgeojson;
let bbox = turf.envelope(pedcycgeojson);

    bboxgeojson = {
        "type": "FeatureCollection",
        "features": [bbox]
    }

map.addSource('collis-box',{
    type: 'geojson',
    data:bboxgeojson
});

// Coordinates for Bounding Box
console.log(bbox)
console.log(bbox.geometry.coordinates)


let bboxcoords = [bbox.geometry.coordinates[0][0][0],
                        bboxscaled.geometry.coordinates[1][0][1],
                        bboxscaled.geometry.coordinates[0][2][1],
                        bboxscaled.geometry.coordinates[0][2][1],];
let hexgeojson = turf.hexGrid(bboxcoordinates, 0.5, {units: 'kilometers'});



/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty
let collisionhex = turf.collect(hexgeojson, ped, '_id', 'values')
console.log(collisionhex)

// Identifying number of collisions in a hexagon
let maxcollisions = 50;

collisionhex.features.forEach((feature) => {
    feature.properties.COUNT = feature.properties.values.length
    if (feature.properties.COUNT > maxcollisions) {
        console.log(feature);
        maxcollisions=feature.properties.COUNT
    }
});




});

// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows


