module.exports = {
	run: function (creep) {
		if (creep.room.name == creep.memory.target) {
			let source = Game.getObjectById(creep.memory.sourceId);
			let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (s) => s.structureType == STRUCTURE_CONTAINER,
			})[0];

			if (container != undefined) {
				if (creep.pos.isEqualTo(container.pos)) {
					creep.harvest(source);
				} else {
					creep.moveTo(container, {
						plainCost: 1,
						swampCost: 2,
					});
				}
			} else {
				let exit = creep.room.findExitTo(creep.memory.target);
				creep.moveTo(creep.pos.findClosestByRange(exit), {
					plainCost: 1,
					swampCost: 2,
				});
			}
		}
	},
};
