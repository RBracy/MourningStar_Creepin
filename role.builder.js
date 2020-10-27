var roleRepairer = require('role.repairer');

module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		// if creep is trying to complete a constructionSite but has no energy left
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

		// if creep is supposed to complete a constructionSite
		if (creep.memory.working == true) {
			// find closest constructionSite
			var constructionSite = creep.pos.findClosestByPath(
				FIND_CONSTRUCTION_SITES
			);
			// if one is found
			if (constructionSite != undefined) {
				// try to build, if the constructionSite is not in range
				if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
					// move towards the constructionSite
					creep.moveTo(constructionSite);
				}
			}
			// if no constructionSite is found
			else {
				// go upgrading the controller
				roleRepairer.run(creep);
			}
		}
		// if creep is supposed to get energy
		else {
			if (creep.getSalvage() == -1) {
				creep.getEnergy(true, true);
			}
		}
	},
};
