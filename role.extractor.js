module.exports = {
	/** @param {Creep} creep **/
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
			let target;

			if (creep.memory.depositId != undefined) {
				target = Game.getObjectById(creep.memory.depositId);
			} else {
				let targets = creep.room.find(FIND_MINERALS);
				target = targets[0];
				creep.memory.depositId = target.id;
				creep.memory.mineralType = target.mineralType;
			}
			let tombs = _.filter(
				creep.room.find(FIND_TOMBSTONES),
				(t) => t.store.getUsedCapacity(creep.memory.mineralType) > 0
			);

			let drops = _.filter(
				creep.room.find(FIND_DROPPED_RESOURCES),
				(d) => d.mineralType == creep.memory.mineralType
			);

			let containers = creep.room.find(FIND_STRUCTURES, {
				filter: (s) =>
					s.structureType == STRUCTURE_CONTAINER &&
					s.store.getUsedCapacity(creep.memory.mineralType) > 0,
			});

			if (tombs.length != 0) {
				let tomb = creep.pos.findClosestByRange(tombs);
				if (
					creep.withdraw(tomb, creep.memory.mineralType) == ERR_NOT_IN_RANGE
				) {
					creep.moveTo(tomb);
				}
			} else if (drops.length != 0) {
				let drop = creep.pos.findClosestByRange(drops);
				if (creep.pickup(drop) == ERR_NOT_IN_RANGE) {
					creep.moveTo(drop);
				}
			} else if (containers.length != 0) {
				if (
					creep.withdraw(containers[0], creep.memory.mineralType) ==
					ERR_NOT_IN_RANGE
				) {
					creep.moveTo(containers[0]);
				}
			} else {
				if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
		} else {
			let terminal = creep.room.terminal;
			let storage = creep.room.storage;
			if (
				terminal != undefined &&
				terminal.store.getUsedCapacity(creep.memory.mineralType) < 10000
			) {
				if (
					creep.transfer(terminal, creep.memory.mineralType) == ERR_NOT_IN_RANGE
				) {
					creep.moveTo(terminal);
				}
			} else if (
				creep.transfer(storage, creep.memory.mineralType) == ERR_NOT_IN_RANGE
			) {
				creep.moveTo(storage);
			}
		}
	},
};
