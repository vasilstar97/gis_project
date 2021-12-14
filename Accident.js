const LatLng = require('./LatLng');

class Accident {
    id = null
    position = null
    dateTime = null
    category = null
    deadCount = 0
    injuredCount = 0

    get year() {
        return this.dateTime.getFullYear();
    }
    
    constructor(feature) {
        this.id = feature.properties.id;
        this.position = new LatLng(feature.properties.point.lat, feature.properties.point.long);
        this.dateTime = new Date(feature.properties.datetime);
        this.category = feature.properties.category;
        this.deadCount = feature.properties.dead_count;
        this.injuredCount = feature.properties.injured_count;
    }
}

module.exports = Accident;