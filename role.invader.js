module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		// if in target room
		if (creep.room.name == creep.memory.target) {
			// find closes hostile creep
			var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			// if one is found...
			if (target != undefined) {
				// try to stab it
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			} else {
				target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
				// try to stab it
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					// But, if it's not close enough to stab, try to shoot it
					creep.moveTo(target);
				}
			}
		}
		// if not in target room
		else {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	},
};
