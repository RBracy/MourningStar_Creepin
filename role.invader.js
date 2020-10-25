module.exports = {
	/** @param {Creep} creep */
	run: function (creep) {
		if (creep.room.name == creep.memory.target) {
			let target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
			if (target != undefined) {
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			} else {
				target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
				if (creep.attack(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
		} else {
			var exit = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	},
};
