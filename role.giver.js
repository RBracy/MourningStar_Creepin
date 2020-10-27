module.exports = {
	/** @param {Creep} creep */
	run: function (creep) {
		let home = creep.memory.home;
		let transferOrder = Game.rooms[home].memory.transferOrder;
		let target = creep.memory.target;

		if (
			creep.memory.working == true &&
			creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0
		) {
			creep.memory.working = false;
		} else if (
			creep.memory.working == false &&
			creep.store.getFreeCapacity() == 0
		) {
			creep.memory.working = true;
			transferOrder.quantity -= creep.store.getUsedCapacity(RESOURCE_ENERGY);
		}

		if (creep.memory.working == true) {
			if (creep.room.name == target) {
				let link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (link) =>
						link.structureType == STRUCTURE_LINK && link.memory.source == true,
				});
				if (link != undefined) {
					if (creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(link);
					}
				} else {
					let storage = creep.room.storage;
					if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(storage);
					}
				}
			} else {
				let exit = creep.room.findExitTo(target);
				creep.moveTo(creep.pos.findClosestByRange(exit), {
					plainCost: 1,
					swampCost: 2,
				});
			}
		} else {
			if (creep.room.name == home) {
				if (
					creep.withdraw(creep.room.storage, RESOURCE_ENERGY) ==
					ERR_NOT_IN_RANGE
				) {
					creep.moveTo(creep.room.storage);
				}
			} else {
				if (transferOrder != undefined) {
					let exit = creep.room.findExitTo(home);
					creep.moveTo(creep.pos.findClosestByRange(exit), {
						plainCost: 1,
						swampCost: 2,
					});
				} else {
					creep.suicide;
				}
			}
		}
	},
};
