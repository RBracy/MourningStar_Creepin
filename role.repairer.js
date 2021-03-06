var roleUpgrader = require('role.upgrader');

module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		// if creep is trying to repair something but has no energy left
		if (
			creep.memory.working == true &&
			creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0
		) {
			// switch state
			creep.memory.working = false;
		}
		// if creep is harvesting energy but is full
		else if (
			creep.memory.working == false &&
			creep.store.getFreeCapacity() == 0
		) {
			// switch state
			creep.memory.working = true;
		}

		// if creep is supposed to repair something
		if (creep.memory.working == true) {
			// find closest structure with less than max hits
			// Exclude walls because they have way too many max hits and would keep
			// our repairers busy forever. We have to find a solution for that later.
			var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
				// the second argument for findClosestByPath is an object which takes
				// a property called filter which can be a function
				// we use the arrow operator to define it
				filter: (s) =>
					s.hits < s.hitsMax &&
					s.structureType != STRUCTURE_WALL &&
					s.structureType != STRUCTURE_RAMPART,
			});

			// if we find one
			if (structure != undefined) {
				// try to repair it, if it is out of range
				if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
					// move towards it
					creep.moveTo(structure);
				}
			}
			// if we can't fine one
			else {
				// look for construction sites
				roleUpgrader.run(creep);
			}
		}
		// if creep is supposed to get energy
		else {
			if (creep.getSalvage() == -1) {
				creep.getEnergy(true, false);
			}
		}
	},
};
