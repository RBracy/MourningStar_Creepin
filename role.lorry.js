module.exports = {
	/** @param {Creep} creep */
	run: function (creep) {
		if (
			creep.memory.working == true &&
			creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0
		) {
			creep.memory.working = false;
		} else if (
			creep.memory.working == false &&
			creep.store.getFreeCapacity() == 0
		) {
			creep.memory.working = true;
		}

		if (creep.memory.working == true) {
			var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter: (s) =>
					(s.structureType == STRUCTURE_SPAWN ||
						s.structureType == STRUCTURE_EXTENSION ||
						s.structureType == STRUCTURE_TOWER) &&
					s.energy < s.energyCapacity,
			});

			if (structure == undefined) {
				structure = creep.room.storage;
			}

			if (structure != undefined) {
				if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(structure);
				}
			}
		} else {
			if (creep.getSalvage() == -1) {
				creep.getEnergy(true, false);
			}
		}
	},
};
