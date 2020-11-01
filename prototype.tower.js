Object.defineProperty(StructureTower.prototype, 'memory', {
	get: function () {
		if (!Memory.structures) {
			Memory.structures = {};
		}
		if (!Memory.structures[this.id]) {
			Memory.structures[this.id] = {};
		}
		return Memory.structures[this.id];
	},
	enumerable: false,
	configurable: true,
});

StructureTower.prototype.runTower = function () {
	if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
		return;
	} else {
		if (this.memory.repairEnabled == undefined) {
			this.memory.repairEnabled = false;
		} else if (
			this.memory.repairEnabled == true &&
			this.store.getUsedCapacity(RESOURCE_ENERGY) >
				this.store.getCapacity(RESOURCE_ENERGY) / 2
		) {
			this.repair();
		}
		this.defend();
		return;
	}
};
StructureTower.prototype.defend = function () {
	var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	if (target == undefined) {
		return;
	} else {
		this.attack(target);
		return;
	}
};

StructureTower.prototype.repair = function () {
	var structures = this.room.find(FIND_STRUCTURES, {
		filter: (s) =>
			s.structureType != STRUCTURE_WALL &&
			s.structureType != STRUCTURE_RAMPART &&
			s.structureType != STRUCTURE_ROAD &&
			s.hits < s.hitsMax / 2,
	});
	if (structures.length == 0) {
		return;
	} else {
		for (
			let percentage = 0.01;
			percentage <= 0.5;
			percentage = percentage + 0.01
		) {
			for (let structure of structures) {
				if (structure.hits / structure.hitsMax < percentage) {
					var target = structure;
					break;
				}
			}
		}
		if (target == undefined) {
			return;
		} else {
			this.repair(target);
			return;
		}
	}
};
