module.exports = {
	/** @param {Creep} creep */
	run: function (creep) {
		if (creep.room.name == creep.memory.target) {
			let controller = creep.room.controller;
			let target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
			if (target != undefined) {
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { plainCost: 1, swampCost: 2, range: 1 });
				}
			} else {
				target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if (target != undefined) {
					if (creep.attack(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { plainCost: 1, swampCost: 2, range: 1 });
					}
				} else {
					if (creep.pos.getRangeTo(controller) > 6) {
						creep.moveTo(controller), { plainCost: 1, swampCost: 2 };
					}
				}
			}
		} else {
			var exit = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exit), {
				plainCost: 1,
				swampCost: 2,
			});
		}
	},
};
