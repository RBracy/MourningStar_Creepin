var roleBuilder = require('role.builder')

module.exports = {
  // a function to run the logic for this role
  /** @param {Creep} creep */
  run: function (creep) {
    // if in target room
    if (creep.room.name == creep.memory.target) {
				// build stuff
				roleBuilder.run(creep);
		}
    // if not in target room
    else {
			// find exit to target room
			var exit = creep.room.findExitTo(creep.memory.target);
			// move to exit
			creep.moveTo(creep.pos.findClosestByRange(exit));
    }
	}
};
