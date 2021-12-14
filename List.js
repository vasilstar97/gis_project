const Pair = require('./Pair');
const maxClusterRadius = require('./variables').maxClusterRadius; //m

class List {
    accidents = []
    pairs = []

    addAccident(newAccident) {
        let pairs = this.accidents.map(oldAccident => new Pair([oldAccident, newAccident])).filter(pair => pair.distance <= maxClusterRadius);
        this.accidents.push(newAccident);
        this.pairs.push(...pairs);
    }

    addAccidents(accidentsArray) {
        let pairs = [];
        for (let i = 0; i < accidentsArray.length-1; i++) {
            const accident1 = accidentsArray[i];
            for (let j = i+1; j < accidentsArray.length; j++) {
                const accident2 = accidentsArray[j];
                const pair = new Pair([accident1, accident2])
                if (pair.distance <= maxClusterRadius) pairs.push(pair);
            }            
        }
        this.accidents.forEach(accident1 => accidentsArray.forEach(accident2 => {
            const pair = new Pair([accident1, accident2])
            if (pair.distance <= maxClusterRadius) pairs.push(pair);
        }))
        this.accidents.push(...accidentsArray)
        this.pairs.push(...pairs);
    }
    
    removePair(targetPair) {
        this.pairs = this.pairs.filter(pair => pair !== targetPair);
    }

    removePairs(accidentsArray) {
        this.pairs = this.pairs.filter(pair => !pair.containsAny(accidentsArray));
    }

    removeAccident(targetAccident) {
        this.accidents = this.accidents.filter(accident => accident !== targetAccident);
        // this.pairs = this.pairs.filter(pair => !pair.contains(targetAccident));
    }

    removeAccidents(accidentsArray) {
        this.accidents = this.accidents.filter(accident => accidentsArray.indexOf(accident) < 0);
    }

    get sortedPairs() {
        return this.pairs.sort((a, b) => a.distance - b.distance);
    }

    get minPair() {
        return this.sortedPairs.length > 0 && this.sortedPairs[0].distance <= maxClusterRadius ? this.sortedPairs[0] : null;
    }

    getMinPair(accidentsArray) {
        let pairs = this.sortedPairs.filter(pair => pair.containsAny(accidentsArray));
        return pairs.length>0 && pairs[0].distance <= maxClusterRadius ? pairs[0] : null;
    }

    constructor(accidents) {
        let pairs = [];
        for (let i = 0; i < accidents.length-1; i++) {
            const accident1 = accidents[i];
            for (let j = i+1; j < accidents.length; j++) {
                const accident2 = accidents[j];
                const pair = new Pair([accident1, accident2])
                if (pair.distance <= maxClusterRadius) pairs.push(pair);
            }            
        }
        this.accidents = accidents;
        this.pairs = pairs
            // .filter(pair => pair.distance <= maxClusterRadius);
    }
}

module.exports = List;