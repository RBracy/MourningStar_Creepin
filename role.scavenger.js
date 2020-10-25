var roleSchlepper = require('role.schlepper');

module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		let target = creep.room.storage;
		if (
			creep.memory.working == false &&
			creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0
		) {
			creep.memory.working = true;
		} else if (
			creep.memory.working == true &&
			creep.store.getFreeCapacity() == 0
		) {
			creep.memory.working = false;
		}

		if (creep.memory.working == true) {
			if (creep.getSalvage() == -1 && creep.room.memory.linksEnabled == true) {
				roleSchlepper.run(creep);
			}
		} else {
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
		}
	},
};
