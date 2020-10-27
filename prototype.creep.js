var roles = {
	harvester: require('role.harvester'),
	upgrader: require('role.upgrader'),
	builder: require('role.builder'),
	repairer: require('role.repairer'),
	wallRepairer: require('role.wallRepairer'),
	longDistanceHarvester: require('role.longDistanceHarvester'),
	claimer: require('role.claimer'),
	claimHolder: require('role.claimHolder'),
	miner: require('role.miner'),
	lorry: require('role.lorry'),
	schlepper: require('role.schlepper'),
	logistics: require('role.logistics'),
	giver: require('role.giver'),
	scavenger: require('role.scavenger'),
	defender: require('role.defender'),
	invader: require('role.invader'),
	remoteConstructor: require('role.remoteConstructor'),
	remoteMiner: require('role.remoteMiner'),
};

Creep.prototype.runRole = function () {
	if (this.memory.role == undefined) {
		this.memory.role = 'harvester';
	}
	if (this.memory.working == undefined) {
		this.memory.working = false;
	}
	if (this.memory.home == undefined) {
		this.memory.home = this.room.name;
	}
	roles[this.memory.role].run(this);
};

/** @function 
    @param {bool} useContainer
    @param {bool} useSource */
Creep.prototype.getEnergy = function (useContainer, useSource) {
	/** @type {StructureContainer} */
	let container;
	let storage = this.room.storage;
	if (useContainer) {
		container = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (s) =>
				((s.structureType == STRUCTURE_LINK && s.memory.target == true) ||
					s.structureType == STRUCTURE_CONTAINER) &&
				s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
		});

		if (
			container != undefined &&
			(storage == undefined ||
				storage.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
		) {
			if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(container);
			}
		} else if (
			container != undefined &&
			storage != undefined &&
			storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0
		) {
			if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(storage);
			}
		}
	}
	if (container == undefined && useSource) {
		let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
		if (this.harvest(source) == ERR_NOT_IN_RANGE) {
			this.moveTo(source);
		}
	}
};

Creep.prototype.getSalvage = function (creep) {
	let drops = this.room.find(FIND_DROPPED_RESOURCES, {
		filter: (drops) => drops.resourceType === RESOURCE_ENERGY,
	});
	let tombstones = this.room.find(FIND_TOMBSTONES, {
		filter: (tombs) => tombs.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
	});
	let ruins = this.room.find(FIND_RUINS, {
		filter: (ruins) => ruins.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
	});

	if (drops.length != 0) {
		let drop = this.pos.findClosestByRange(drops);
		if (this.pickup(drop) == ERR_NOT_IN_RANGE) {
			this.moveTo(drop);
			return 0;
		}
	} else if (tombstones.length != 0) {
		let tomb = this.pos.findClosestByRange(tombstones);
		if (this.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveTo(tomb);
			return 0;
		}
	} else if (ruins.length != 0) {
		let ruin = this.pos.findClosestByRange(ruins);
		if (this.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.moveTo(ruin);
			return 0;
		}
	} else {
		return -1;
	}
};
