const circleToPolygon = require('circle-to-polygon');

const clustersToGeojson = (clusters) => {
    let result = clusters.map((cluster, clusterIndex) => ({
        polygon: {
            "type": "Feature",
            "geometry": circleToPolygon([cluster.center.lng, cluster.center.lat], cluster.radius<5?5:cluster.radius, { numberOfEdges: 16 }),
            "properties": {
                id: clusterIndex,
                radius: cluster.radius,
            }
        },
        accidents: cluster.accidents.map(accident => ({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [accident.position.lng, accident.position.lat]
            },
            "properties": {
                id: accident.id,
                dateTime: accident.dateTime,
                category: accident.category,
                deadCount: accident.deadCount,
                injuredCount: accident.injuredCount
            }
        }))
    }))
    
    return JSON.stringify(result);
}

module.exports = {
    clustersToGeojson: clustersToGeojson,
    accidentsToGeojson: accidentsToGeojson
}