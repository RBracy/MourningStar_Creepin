var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    claimer: require('role.claimer'),
	claimHolder: require('role.claimHolder'),
    miner: require('role.miner'),
    lorry: require('role.lorry'),
    schlepper: require('role.schlepper'),
    logistics: require('role.logistics'),
    scavenger: require('role.scavenger'),
    defender: require('role.defender'),
	invader: require('role.invader'),
	remoteConstructor: require('role.remoteConstructor')
};

Creep.prototype.runRole =
    function () {
        if (this.memory.role == undefined) {
            this.memory.role = 'harvester';
        }
        if (this.memory.working == undefined) {
            this.memory.working = false;
        }
        if (this.memory.home == undefined) {
            this.memory.home = this.room.name;
        }
        roles[this.memory.role].run(this);
    };


/** @function 
    @param {bool} useContainer
    @param {bool} useSource */
Creep.prototype.getEnergy =
    function (useContainer, useSource) {
        /** @type {StructureContainer} */
        let container;
        if (useContainer) {
            switch (this.room.memory.logisticsEnabled) {
                case true:
                    container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => s.structureType == (STRUCTURE_STORAGE || 
                        s.structureType == STRUCTURE_LINK) && 
                        s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    });
                    break;
                default:
                    container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                     s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    });
                    break;
            }
            
            if (container != undefined) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
        }
        if (container == undefined && useSource) {
            let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
    };

Creep.prototype.getSalvage =
    function (creep) {
        let drops = this.room.find(FIND_DROPPED_RESOURCES, {
            filter: drops => drops.resourceType === RESOURCE_ENERGY
        });
        let tombstones = this.room.find(FIND_TOMBSTONES, { 
            filter: tombs => tombs.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        });
        let ruins = this.room.find(FIND_RUINS, {
            filter: ruins => ruins.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        });
        
        if (drops.length != 0) {
            let drop = this.pos.findClosestByRange(drops);
            if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                this.moveTo(drop);
                return 0;
            }
        }

        else if (tombstones.length != 0) {
            let tomb = this.pos.findClosestByRange(tombstones);
            if (this.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(tomb);
                return 0;
            }
        }

        else if (ruins.length != 0) {
            let ruin = this.pos.findClosestByRange(ruins);
            if (this.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(ruin);
                return 0;
            }
        }
        else {return -1;}
    };

//Code provided by Shibdib in screeps slack server
//Creep.prototype.getEnergy =
//    function (useContainer, useSource, useStorage, getDrops) {
//        /** @type {StructureContainer} */
/*        if (Game.getObjectById(this.memory.energyItem)) {
            let energyTarget = Game.getObjectById(this.memory.energyItem);
            if (this.withdraw(energyTarget) == ERR_NOT_IN_RANGE) {
                this.moveTo(energyTarget);
            }
        } else {
            let container;
            if (container == undefined && useStorage){
                if (this.room.storage.store[RESOURCE_ENERGY]) {
                    return this.memory.energyItem = this.room.storage.id;
                }
            }
        }
    };
*/

// This is my attempt to create a getEnergy function that can do more. it needs work
//    /** @function
//    @param {bool} useContainer
//    @param {bool} useSource 
//   @param {bool} useStorage
//    @param {bool} getDrops */
//Creep.prototype.getEnergy =
//    function (useContainer, useSource, useStorage, getDrops) {
//        /** @type {StructureContainer} */
/*        let container;
        let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let drops = this.room.find(FIND_DROPPED_RESOURCES, {
            filter: drops => drops.resourceType === RESOURCE_ENERGY
        });
        if (useContainer) {
            container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER) &&
                    s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined) {
                if (this.withdraw(container) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
                return;
            }
        }
        else if (container == undefined && getDrops && drops.length > 0) {
            let drop = this.pos.findClosestByRange(drops);
            if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                this.moveTo(drop);
            }
            return;

        }
        else if (container == undefined && useStorage){
            let storage = this.room.storage;
            if (this.withdraw(storage) == ERR_NOT_IN_RANGE) {
                this.moveTo(storage);
            }
            return;
        }
        else if (container == undefined && useSource) {
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
            return;
        }
    };
*/
/*
    switch (useContainer) {
        case true:
            container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || 
                    s.structureType == STRUCTURE_STORAGE) &&
                    s.store[RESOURCE_ENERGY] > 0
            });
            switch (container) {
                case undefined:
                    break;
                default:
                    if (this.withdraw(container) == ERR_NOT_IN_RANGE) {
                        this.moveTo(container);
                    }
                    break;
            }
        case false:
            switch (useSource) {
                case true:
                    let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                        this.moveTo(source);
                    }
                    break;
                case false:
                    break;
            }
        noSource:
            switch (getDrops) {
                case true:
                    let drops = this.room.find(FIND_DROPPED_RESOURCES, {
                        filter: drops => drops.resourceType === RESOURCE_ENERGY
                    });

                    if (drops.length > 0) {
                        let drop = this.room.findClosestByRange(drops);
                        if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                            this.moveTo(drop);
                        }
                    }
                    break theEnd;
                case false:
                    console.log('nothing to harvest, no containers, no salvage');
                    break;
            }
        theEnd:
        break;
    }
*/

/* Old getEnergy() code:
        if (useContainer) {
            container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || 
                    s.structureType == STRUCTURE_STORAGE) &&
                    s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined) {
                if (this.withdraw(container) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
        }

        if (container == undefined && getDrops && drops.length > 0) {
            let drop = this.pos.findClosestByRange(drops);
            if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                this.moveTo(drop);
            }
        }

        if (container == undefined && useSource) {
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                this.moveTo(source);
            }
        }
*/

///** @function 
//    @param {bool} useContainer
//    @param {bool} useSource */
//    Creep.prototype.getEnergy =
//    function (useContainer, useSource) {
//        /** @type {StructureContainer} */
/*      let container;
        let drop = this.pos.findClosestByRange(this.room.find(FIND_DROPPED_RESOURCES, {
            filter: drops => drops.resourceType === RESOURCE_ENERGY
        }));
        let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);


        if (useContainer) {
            container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || 
                        s.structureType == STRUCTURE_STORAGE) && 
                        s.store[RESOURCE_ENERGY] > 0
            });

            if (container != undefined) {
                if (this.pos.getRangeTo(container) < this.pos.getRangeTo(drop)) {
                    if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        this.moveTo(container);
                    }
                }
                else {
                    if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                        this.moveTo(drop);
                    }
                }
            }
        }
        
        if (container == undefined && useSource) {
            if (this.pos.getRangeTo(source) < this.pos.getRangeTo(drop)) {
                if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                    this.moveTo(source);
                }
            }
            else {
                if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
                    this.moveTo(drop);
                }
            }
        }
    };
*/