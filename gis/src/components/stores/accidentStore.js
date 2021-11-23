import { makeAutoObservable } from "mobx";
import accidentsJson from './accidents.json';
import leafletPip from 'leaflet-pip';
import L from 'leaflet';

class AccidentStore {

    mainStore = null
    accidents = []

    get pedestrianAccidents() {
        return this.accidents.filter(accident => accident.category === 'Наезд на пешехода');
    }

    getAccidents(cellGeojson) {
        let layer = L.geoJSON(cellGeojson);
        console.log(leafletPip.pointInLayer(this.accidents[0].position, layer))
        return [];
    }

    constructor(mainStore) {
        makeAutoObservable(this);
        this.mainStore = mainStore;
        this.accidents = accidentsJson.features.sort((a,b) => a.properties.point.long - b.properties.point.long).map(accidentGeojson => new Accident(accidentGeojson));
    }
}

class Accident {
    position = null
    severity = null
    category = null

    constructor(feature) {
        makeAutoObservable(this);
        this.position = [feature.properties.point.lat,feature.properties.point.long];
        this.severity = feature.properties.severity;
        this.category = feature.properties.category;
    }
}

export default AccidentStore;