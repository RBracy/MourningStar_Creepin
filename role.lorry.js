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
						s.structureType == STRUCTURE_EXTENSION) &&
					s.store.getUsedCapacity(RESOURCE_ENERGY) <
					s.store.getCapacity(RESOURCE_ENERGY),
			});

			if (structure == undefined) {
				structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (s) =>
						s.structureType == STRUCTURE_TOWER &&
						s.store.getUsedCapacity(RESOURCE_ENERGY) <
							s.store.getCapacity(RESOURCE_ENERGY),
				});
			}

			if (structure == undefined) {
				structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (l) =>
						l.structureType == STRUCTURE_LAB &&
						l.store.getUsedCapacity(RESOURCE_ENERGY) <
							l.store.getCapacity(RESOURCE_ENERGY),
				});
			}

			if (
				structure == undefined &&
				creep.room.terminal &&
				creep.room.terminal.memory.requisitions['energy'] > 0
			) {
				structure = creep.room.terminal;
			}
			//Pretty sure this was causing my lorries to constantly withdraw and redeposit energy from storage if they had no other work to do.
			//if (structure == undefined) {
			//	structure = creep.room.storage;
			//}

			if (structure != undefined && structure === creep.room.terminal) {
				switch (creep.transfer(structure, RESOURCE_ENERGY)) {
					case 0:
						creep.room.terminal.memory.requisitions[
							'energy'
						] -= creep.store.getCapacity();
						break;
					case -9:
						creep.moveTo(structure);
						break;
				}
			}
			if (structure != undefined) {
				if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(structure);
				}
			}
		} else {
			creep.getEnergy(true, false);
		}
	},
};
