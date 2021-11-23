import { makeAutoObservable } from "mobx";
import AccidentStore from './accidentStore';
import GridStore from "./gridStore";

class MainStore {
    accidentStore = null
    gridStore = null

    constructor() {
        makeAutoObservable(this);
        this.accidentStore = new AccidentStore(this);
        this.gridStore = new GridStore(this);
    }
}

export default new MainStore();