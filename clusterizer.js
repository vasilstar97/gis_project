const fs = require('fs');
const LatLng = require('./LatLng');
const Accident = require('./Accident');
const Cluster = require('./Cluster');
const Pair = require('./Pair');
const List = require('./List');
let data = require('./accidents.json');
const maxClusterRadius = require('./variables').maxClusterRadius; //m
const clustersToGeojson = require('./toGeojson').clustersToGeojson;
const accidentsToGeojson = require('./toGeojson').accidentsToGeojson;

let accidents = data.features
    // .filter(accident => accident.properties.category === 'Наезд на пешехода')
    // .filter(accident => accident.properties.dead_count > 0)
    .map(accident => new Accident(accident))
    .filter(accident => accident.year > 2018)
console.log("Количество объектов: ",accidents.length)

let clusters = [];
let list = new List(accidents);

while (list.minPair !== null) {
    console.log(list.accidents.length, list.pairs.length)
    let pair = list.minPair;
    list.removePair(pair);
    let cluster = new Cluster(pair.accidents)
    clusters.push(cluster);
    while (list.getMinPair(cluster.accidents) !== null) {
        let minPair = list.getMinPair(cluster.accidents);
        list.removePair(minPair);
        cluster.addAccidents(minPair.accidents);
        list.removeAccidents(cluster.accidents);
    }
    list.removePairs(cluster.accidents);
    while (cluster.extraAccident !== null) {
        let extraAccident = cluster.extraAccident;
        cluster.removeAccident(extraAccident);
        list.addAccident(extraAccident);
    }
    // let extraAccidents = cluster.removeExtraAccidents();
    // list.removePairs(cluster.accidents);
    // list.addAccidents(extraAccidents);
}

console.log('Количество кластеров: ',clusters.length)

fs.writeFile('./gis/src/clusters.json', clustersToGeojson(clusters), () => {})
// fs.writeFile('./gis/src/accidents.json', accidentsToGeojson(accidents), () => {})



