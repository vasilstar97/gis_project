const LatLng = require('./LatLng');
const maxClusterRadius = require('./variables').maxClusterRadius; //m

class Cluster {
    accidents = []

    get radius() {
        return Math.max(...this.accidents.map(accident => accident.position.distanceTo(this.center)));
    }

    get center() {
        let N = this.accidents.length;
        let lat = this.accidents.reduce((sum, accident) => sum + accident.position.lat, 0) / N;
        let lng = this.accidents.reduce((sum, accident) => sum + accident.position.lng, 0) / N;
        return new LatLng(lat, lng);
    }

    removeExtraAccidents() {
        let center = this.center;
        let extraAccidents = this.accidents.filter(accident => accident.position.distanceTo(center) > maxClusterRadius);
        this.accidents = this.accidents.filter(accident => accident.position.distanceTo(center) <= maxClusterRadius);
        return extraAccidents;
    }

    get sortedAccidents() {
        let center = this.center;
        return this.accidents.sort((a, b) => b.position.distanceTo(center) - a.position.distanceTo(center));
    }

    get extraAccident() {
        let center = this.center;
        let extraAccidents = this.sortedAccidents.filter(accident => accident.position.distanceTo(center) > maxClusterRadius);
        return extraAccidents.length>0 ? extraAccidents[0] : null;
    }

    addAccident(accident) {
        this.accidents.push(accident);
    }

    addAccidents(accidentsArray) {
        this.accidents.push(...accidentsArray.filter(accident => this.accidents.indexOf(accident) < 0));
    }

    removeAccident(accident) {
        this.accidents = this.accidents.filter(acc => acc !== accident);
    }

    constructor(accidentsArray) {
        this.accidents = [...accidentsArray];
    }
}

module.exports = Cluster;