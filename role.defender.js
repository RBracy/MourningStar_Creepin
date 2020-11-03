module.exports = {
	run: function (creep) {
		var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target != undefined) {
			if (creep.attack(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
		} else {
			if (creep.pos.getRangeTo(controller) > 6) {
				creep.moveTo(controller), { plainCost: 1, swampCost: 2 };
			}
		}
	},
};
