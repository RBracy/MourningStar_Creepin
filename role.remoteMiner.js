module.exports = {
	run: function (creep) {
		if (creep.room.name == creep.memory.target) {
			let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
			let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER,
			})[0];

			if (container != undefined) {
				if (creep.pos.isEqualTo(container.pos)) {
					creep.harvest(source);
				} else {
					creep.moveTo(container);
				}
			} else {
				creep.getEnergy(false, true);
			}
		} else {
			let exit = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	},
};
