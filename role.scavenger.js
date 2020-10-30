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
			let drops = creep.room.find(FIND_DROPPED_RESOURCES);
			let tombs = creep.room.find(FIND_TOMBSTONES, {
				filter: (t) => t.store.getUsedCapacity() > 0,
			});
			let ruins = creep.room.find(FIND_RUINS, {
				filter: (r) => r.store.getUsedCapacity() > 0,
			});
			let salvage = [];
			salvage = salvage.concat(drops, tombs, ruins);

			if (salvage.length > 0) {
				let target = _.maxBy(salvage, _.property(store).getUsedCapacity());

				if (target instanceof Resource) {
					if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
					return;
				} else if (target instanceof Tombstone || target instanceof Ruin) {
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
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
