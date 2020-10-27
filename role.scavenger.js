const roleLorry = require('role.lorry');

module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		let target = creep.room.storage;
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

		if (creep.memory.working == false) {
			if (creep.getSalvage() == -1) {
				roleLorry.run(creep);
			}
		} else {
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
		}
	},
};
