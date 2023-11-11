const requisitions = [
	'H',
	'O',
	'U',
	'L',
	'K',
	'Z',
	'X',
	'G',
	'silicon',
	'metal',
	'biomass',
	'mist',
	'energy',
	'power',
];

module.exports = {
	/** @param {Creep} creep */
	run: function (creep) {
		const link = creep.room.find(FIND_STRUCTURES, {
			filter: (link) =>
				link.structureType == STRUCTURE_LINK && link.memory.target == true,
		});

		const storage = creep.room.storage;
		const terminal = creep.room.terminal;

		if (creep.memory.working == true && creep.store.getUsedCapacity() == 0) {
			creep.memory.working = false;
			delete creep.memory.resourceType; // Delete memory of the resource just unloaded
		} else if (
			creep.memory.working == false &&
			creep.store.getFreeCapacity() == 0
		) {
			creep.memory.working = true;
		}

		if (creep.memory.working == false) {
			if (link[0] != undefined && link[0].store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
				switch (creep.withdraw(link[0], RESOURCE_ENERGY)) {
					case OK:
						creep.memory.working = true;
						break;
					case ERR_NOT_IN_RANGE:
						creep.moveTo(link[0]);
						break;
				}
			} else {
				for (let resType of requisitions) {
					if (
						terminal.memory.requisitions[resType] > 0 &&
						storage.store.getUsedCapacity(resType) > 0
					) {
						switch (creep.withdraw(storage, resType)) {
							case OK:
								creep.memory.resourceType = resType;
								break;
							case ERR_NOT_IN_RANGE:
								creep.moveTo(storage);
								break;
						}
					}
				}
			}
		} else {
			var resource = creep.memory.resourceType;
			if (
				creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
				(terminal.memory.requisitions['energy'] <= 0 ||
					creep.memory.resourceType == undefined)
			) {
				switch (creep.transfer(storage, RESOURCE_ENERGY)) {
					case OK:
						break;
					case ERR_NOT_IN_RANGE:
						creep.moveTo(storage);
						break;
				}
			} else if (
				resource != undefined &&
				creep.store.getUsedCapacity(resource) > 0
			) {
				switch (creep.transfer(terminal, resource)) {
					case OK:
						terminal.memory.requisitions[resource] -= creep.store.getCapacity();
						break;
					case ERR_NOT_IN_RANGE:
						creep.moveTo(terminal);
						break;
				}
			}
		}
	},
};
