var roleBuilder = require('role.builder');

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
			// find all walls in the room
			var walls = creep.room.find(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_WALL,
			});

			var ramparts = creep.room.find(FIND_STRUCTURES, {
				filter: (s) => s.structureType == STRUCTURE_RAMPART,
			});

			var target = undefined;

			// loop with increasing percentages
			for (
				let percentage = 0.001;
				percentage <= 1;
				percentage = percentage + 0.001
			) {
				// find a wall with less than percentage hits
				for (let rampart of ramparts) {
					if (rampart.hits / rampart.hitsMax < percentage) {
						target = rampart;
						break;
					}
				}

				// if there is one
				if (target != undefined) {
					// break the loop
					break;
				}
			}
			// if we find a rampart that has to be repaired
			if (target != undefined) {
				// try to repair it, if not in range
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					// move towards it
					creep.moveTo(target);
				}
			}

			// loop with increasing percentages
			for (
				let percentage = 0.0001;
				percentage <= 1;
				percentage = percentage + 0.0001
			) {
				// find a wall with less than percentage hits
				for (let wall of walls) {
					if (wall.hits / wall.hitsMax < percentage) {
						target = wall;
						break;
					}
				}

				// if there is one
				if (target != undefined) {
					// break the loop
					break;
				}
			}

			// if we find a wall that has to be repaired
			if (target != undefined) {
				// try to repair it, if not in range
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					// move towards it
					creep.moveTo(target);
				}
			}
			// if we can't fine one
			else {
				// look for construction sites
				roleBuilder.run(creep);
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
