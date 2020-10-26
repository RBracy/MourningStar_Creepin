module.exports = {
	run: function (creep) {
		if (creep.room.name != creep.memory.target) {
			var exit = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exit), {
				plainCost: 1,
				swampCost: 2,
			});
		} else {
			switch (creep.reserveController(creep.room.controller)) {
				case ERR_NOT_IN_RANGE:
					creep.moveTo(creep.room.controller, {
						plainCost: 1,
						swampCost: 2,
						range: 1,
					});
					break;
				case ERR_INVALID_TARGET:
					creep.attackController(creep.room.controller);
					break;
			}
		}
	},
};
