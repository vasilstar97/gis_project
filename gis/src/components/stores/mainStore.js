import { makeAutoObservable, toJS } from "mobx";

class MainStore {
    cluster = null

    get selectedCluster() {
        return toJS(this.cluster);
    }

    setSelectedCluster(cluster) {
        console.log(cluster, this.cluster)
        if (this.cluster && this.cluster.polygon.properties.id === cluster.polygon.properties.id) this.cluster = null;
        else this.cluster = cluster;
    }

    constructor() {
        makeAutoObservable(this);
    }
}

export default new MainStore();