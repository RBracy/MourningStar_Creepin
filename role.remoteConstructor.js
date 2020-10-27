var roleBuilder = require('role.builder');

module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		if (creep.room.name == creep.memory.target) {
			roleBuilder.run(creep);
		} else {
			var exit = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	},
};
