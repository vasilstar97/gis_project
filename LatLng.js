class LatLng { 
    lat = null
    lng = null

    distanceTo(latLng) {
        const [lat1, lon1] = [latLng.lat, latLng.lng], [lat2, lon2] = [this.lat, this.lng];
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

        return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
    }

    constructor(lat, lng) { 
        this.lat = lat;
        this.lng = lng;
    }
}

module.exports = LatLng;