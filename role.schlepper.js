module.exports = {
    /** @param {Creep} creep */
    run: function (creep) {
        let link = creep.room.find(FIND_STRUCTURES, {
            filter: (link) => link.structureType == STRUCTURE_LINK && link.memory.target == true
        });

        if (creep.memory.working == true && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == false && link[0].store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            let structure = creep.room.storage;
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        }
        else {
            if (link[0].store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                if (creep.withdraw(link[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link[0]);
                }
            }
        }
    }
};