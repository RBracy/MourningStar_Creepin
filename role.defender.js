module.exports = {
	// a function to run the logic for this role
	run: function (creep) {
		// find closes hostile creep
		var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		// if one is found...
		if (target != undefined) {
			// try to stab it
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				// But, if it's not close enough to stab, try to shoot it
				if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
					// and if that doesn't work, get closer, real friendly-like
					creep.moveTo(target);
				}
			}
		}
	},
};
