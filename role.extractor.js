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
		if (creep.memory.working) {
			let target;

			if (creep.memory.depositId != undefined) {
				target = Game.getObjectById(creep.memory.depositId);
			} else {
				let targets = creep.room.find(FIND_MINERALS);
				target = targets[0];
				creep.memory.depositId = target.id;
				creep.memory.mineralType = target.mineralType;
			}
			if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
			}
		} else {
			let storage = creep.room.storage;
			if (
				creep.transfer(storage, creep.memory.mineralType) == ERR_NOT_IN_RANGE
			) {
				creep.moveTo(storage);
			}
		}
	},
};
