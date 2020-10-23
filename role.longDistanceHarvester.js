module.exports = {
    /** @param {Creep} creep */
    run: function (creep) {
        if (creep.memory.working == true && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true) {
            if (creep.room.name == creep.memory.home) {
                let link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (link) => (link.structureType == STRUCTURE_LINK && 
                        link.memory.source == true)
                });
                if (link != undefined) {
                    if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                }
                else {
                    let storage = creep.room.storage;
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
            else {
                let exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        else {
            if (creep.room.name == creep.memory.target) {
                if (creep.getSalvage() == -1) {
                creep.getEnergy(true, true);
                }
            }
            else {
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};
