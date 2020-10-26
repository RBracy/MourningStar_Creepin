module.exports = {
	// a function to run the logic for this role
	run: function (creep) {
		// if in target room
		if (creep.room.name != creep.memory.target) {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit));
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
