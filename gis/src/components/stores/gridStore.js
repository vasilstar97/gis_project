import { makeAutoObservable } from "mobx";
import gridJson from './grid.json';

class GridStore {

    mainStore = null
    cells = []

    constructor(mainStore) {
        makeAutoObservable(this);
        this.mainStore = mainStore;
        this.cells = gridJson.features.map(cellGeojson => new Cell(cellGeojson, mainStore.accidentStore.getAccidents(cellGeojson)));
    }
}

class Cell {
    accidents = []
    geojson = null
    id = null
    center = null

    get accidentsCount() {
        return this.accidents.length;
    }

    constructor(geojson, accidents) {
        makeAutoObservable(this);
        this.accidents = accidents;
        this.geojson = geojson;
    }
}

export default GridStore;