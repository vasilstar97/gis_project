class Pair {
    accidents = []

    get distance() {
        return this.accidents[0].position.distanceTo(this.accidents[1].position);
    }

    contains(accident) {
        return this.accidents[0] === accident || this.accidents[1] === accident;
    }

    containsBoth(accident1, accident2) {
        return this.contains(accident1) && this.contains(accident2);
    }

    containsAny(accidentsArray) {
        return accidentsArray.reduce((b, accident) => b || this.contains(accident), false);
    }

    constructor(accidentsArray) {
        this.accidents = [...accidentsArray];
    }
}

module.exports = Pair;