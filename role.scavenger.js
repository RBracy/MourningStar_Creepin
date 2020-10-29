module.exports = {
	// a function to run the logic for this role
	/** @param {Creep} creep */
	run: function (creep) {
		if (creep.memory.working == true && creep.store.getFreeCapacity() == 0) {
			creep.memory.working = false;
		} else if (
			creep.memory.working == false &&
			creep.store.getUsedCapacity() == 0
		) {
			creep.memory.working = true;
		}
		if (creep.memory.working == true) {
			let drops = [];
			drops = drops.concat(
				creep.room.find(FIND_DROPPED_RESOURCES),
				creep.room.find(FIND_TOMBSTONES, {
					filter: (t) => t.store.getUsedCapacity() > 0,
				}),
				creep.room.find(FIND_RUINS, {
					filter: (r) => r.store.getUsedCapacity() > 0,
				})
			);

			if (drops.length > 0) {
				let drop = _.max(drops, (drop) => drop.store.getUsedCapacity());

				if (drop instanceof RESOURCE_ENERGY) {
					if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
						creep.moveTo(drop);
					}
					return;
				} else if (drop instanceof Tombstone || drop instanceof Ruin) {
					if (creep.withdraw(drop, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(drop);
					}
				}
			}
		} else {
			let target = creep.room.storage;
			if (target == undefined) {
				target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (s) =>
						(s.structureType == STRUCTURE_SPAWN ||
							s.structureType == STRUCTURE_EXTENSION ||
							s.structureType == STRUCTURE_TOWER) &&
						s.store.getUsedCapacity(RESOURCE_ENERGY) <
							s.store.getFreeCapacity(RESOURCE_ENERGY),
				});
			}
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
		}
	},
};
