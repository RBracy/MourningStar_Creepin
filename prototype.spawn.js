var listOfRoles = [
	'builder',
	'defender',
	'harvester',
	'logistics',
	'lorry',
	'miner',
	'repairer',
	'scavenger',
	'upgrader',
	'wallRepairer',
];

// a "Heads-up-display" that will give a readout of important stats, every 6 ticks (30s)
StructureSpawn.prototype.headsUpDisplay = function (tickTock) {
	if (tickTock >= 5) {
		let storage = this.room.storage;
		console.log(
			'***** {' +
				this.name +
				': Energy: ' +
				this.room.energyAvailable +
				'/' +
				this.room.energyCapacityAvailable +
				' | Storage: ' +
				storage.store.getUsedCapacity(RESOURCE_ENERGY) +
				'/' +
				storage.store.getFreeCapacity() +
				'} *****'
		);
	}
};

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
	/** @type {Room} */
	let room = this.room;
	// find all creeps that "belong to" this room
	/** @type {Array.<Creep>} */
	let creepsInRoom = _.filter(
		Game.creeps,
		(c) => c.memory.home == this.room.name
	);

	// count the number of creeps alive for each role in this room
	// _.sum will count the number of properties in Game.creeps filtered by the
	//  arrow function, which checks for the creep being a specific role
	/** @type {Object.<string, number>} */
	let numberOfCreeps = {};
	for (let role of listOfRoles) {
		numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
	}
	let maxEnergy = room.energyCapacityAvailable;
	let name = undefined;

	// if no harvesters are left AND either no miners or no lorries are left
	//  create a backup creep
	if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0) {
		// if there are still miners or enough energy in Storage left
		if (
			numberOfCreeps['miner'] > 0 ||
			(room.storage != undefined &&
				room.storage.store[RESOURCE_ENERGY] >= 150 + 550)
		) {
			// create a lorry
			name = this.createLorry(150);
		}
		// if there is no miner and not enough energy in Storage left
		else {
			// create a harvester because it can work on its own
			name = this.createCustomCreep(room.energyAvailable, 'harvester');
		}
	}
	// if no backup creep is required
	else {
		// check if all sources have miners
		let sources = room.find(FIND_SOURCES);
		// iterate over all sources
		for (let source of sources) {
			// if the source has no miner
			if (
				!_.some(
					creepsInRoom,
					(c) => c.memory.role == 'miner' && c.memory.sourceId == source.id
				)
			) {
				// check whether or not the source has a container
				/** @type {Array.StructureContainer} */
				let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
					filter: (s) => s.structureType == STRUCTURE_CONTAINER,
				});
				// if there is a container next to the source
				if (containers.length > 0) {
					// spawn a miner
					name = this.createMiner(source.id);
					break;
				}
			}
		}
		if (room.memory.logisticsEnabled == true) {
			for (let source of sources) {
				// if the source has no logistics
				if (
					!_.some(
						creepsInRoom,
						(c) =>
							c.memory.role == 'logistics' && c.memory.sourceId == source.id
					)
				) {
					// check whether or not the source has a container
					/** @type {Array.StructureContainer} */
					let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
						filter: (s) => s.structureType == STRUCTURE_CONTAINER,
					});
					// if there is a container next to the source
					if (containers.length > 0) {
						// spawn a logistics creep
						name = this.createLogistics(source.id);
						break;
					}
				}
			}
		}
		// What about remote mining?
		if (name == undefined) {
			for (let room in Game.rooms) {
				if (Game.rooms[room].memory.remoteMiningEnabled == true) {
					sources = Game.rooms[room].find(FIND_SOURCES);
					for (let source of sources) {
						let creepsAtTarget = _.filter(
							Game.creeps,
							(c) =>
								c.memory.target == Game.rooms[room].name ||
								c.room.name == Game.rooms[room].name
						);
						if (
							!_.some(
								creepsAtTarget,
								(c) =>
									c.memory.role == 'remoteMiner' &&
									c.memory.sourceID == source.id
							)
						) {
							let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
								filter: (s) => s.structureType == STRUCTURE_CONTAINER,
							});

							if (containers.length > 0) {
								name = this.createRemoteMiner(Game.rooms[room].name, source.id);
								break;
							}
						}
					}
				}
			}
		}
	}
	// if none of the above caused a spawn command check for other roles
	if (name == undefined) {
		for (let role of listOfRoles) {
			// check for claim order
			if (role == 'claimer' && this.memory.claimRoom != undefined) {
				// try to spawn a claimer
				name = this.createClaimer(this.memory.claimRoom);
				// if that worked
				if (name != undefined && _.isString(name)) {
					// delete the claim order
					delete this.memory.claimRoom;
				}
			}
			// if no claim order was found, check other roles
			else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
				if (role == 'lorry') {
					name = this.createLorry(150);
				}
				if (role == 'logistics') {
					name = this.createLogistics();
				}
				if (role == 'scavenger') {
					name = this.createScavenger(300);
				} else {
					name = this.createCustomCreep(maxEnergy, role);
				}
				break;
			}
		}
	}

	// Next we'll see if there are any reserve orders
	let numberOfClaimHolders = {};
	if (name == undefined) {
		// count the number of Claim Holders
		for (let roomName in this.memory.minClaimHolders) {
			numberOfClaimHolders[roomName] = _.sum(
				Game.creeps,
				(c) =>
					c.memory.role == 'claimHolder' &&
					c.memory.target == roomName &&
					c.memory.home == room.name
			);

			if (
				numberOfClaimHolders[roomName] < this.memory.minClaimHolders[roomName]
			) {
				name = this.createClaimHolder(roomName);
			}
		}
	}

	// Next we'll see if there are any remote construction orders
	let numberOfRemoteConstructors = {};
	if (name == undefined) {
		// count the number of remote constructors
		for (let roomName in this.memory.minRemoteConstructors) {
			numberOfRemoteConstructors[roomName] = _.sum(
				Game.creeps,
				(c) =>
					c.memory.role == 'remoteConstructor' &&
					c.memory.target == roomName &&
					c.memory.home == room.name
			);

			if (
				numberOfRemoteConstructors[roomName] <
				this.memory.minRemoteConstructors[roomName]
			) {
				name = this.createRemoteConstructor(roomName);
			}
		}
	}

	// Next we'll see if there are any invasion plans
	let numberOfInvaders = {};
	if (name == undefined) {
		// count the number of invaders
		for (let roomName in this.memory.minInvaders) {
			numberOfInvaders[roomName] = _.sum(
				Game.creeps,
				(c) =>
					c.memory.role == 'invader' &&
					c.memory.target == roomName &&
					c.memory.home == room.name
			);

			if (numberOfInvaders[roomName] < this.memory.minInvaders[roomName]) {
				name = this.createInvader(roomName);
			}
		}
	}

	// if none of the above caused a spawn command check for LongDistanceHarvesters
	/** @type {Object.<string, number>} */
	let numberOfLongDistanceHarvesters = {};
	if (name == undefined) {
		// count the number of long distance harvesters globally
		for (let roomName in this.memory.minLongDistanceHarvesters) {
			numberOfLongDistanceHarvesters[roomName] = _.sum(
				creepsInRoom,
				(c) =>
					c.memory.role == 'longDistanceHarvester' &&
					c.memory.target == roomName
			);

			if (
				numberOfLongDistanceHarvesters[roomName] <
				this.memory.minLongDistanceHarvesters[roomName]
			) {
				name = this.createLongDistanceHarvester(
					maxEnergy,
					2,
					this.room.name,
					roomName
				);
			}
		}
	}

	// print name to console if spawning was a success
	if (name != undefined && _.isString(name)) {
		console.log(
			this.name +
				' spawned new creep: ' +
				name +
				' (' +
				Game.creeps[name].memory.role +
				')'
		);
		for (let role of listOfRoles) {
			console.log(role + ': ' + numberOfCreeps[role]);
		}
		for (let roomName in numberOfLongDistanceHarvesters) {
			console.log(
				'LongDistanceHarvester' +
					roomName +
					': ' +
					numberOfLongDistanceHarvesters[roomName]
			);
		}
		for (let roomName in numberOfClaimHolders) {
			console.log(
				'ClaimHolder' + roomName + ': ' + numberOfClaimHolders[roomName]
			);
		}
		for (let roomName in numberOfRemoteConstructors) {
			console.log(
				'RemoteConstructor' +
					roomName +
					': ' +
					numberOfRemoteConstructors[roomName]
			);
		}
		for (let roomName in numberOfInvaders) {
			console.log('Invader' + roomName + ': ' + numberOfInvaders[roomName]);
		}
	}
};

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
	// create a balanced body as big as possible with the given energy
	var numberOfParts = Math.floor(energy / 200);
	// make sure the creep is not too big (more than 50 parts)
	numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
	var body = [];
	for (let i = 0; i < numberOfParts; i++) {
		body.push(WORK);
	}
	for (let i = 0; i < numberOfParts; i++) {
		body.push(CARRY);
	}
	for (let i = 0; i < numberOfParts; i++) {
		body.push(MOVE);
	}

	// create creep with the created body and the given role
	return this.spawnCreep(body, roleName + '_' + Game.time, {
		memory: { role: roleName, working: false, home: this.room.name },
	});
};

// create a new function for StructureSpawn
StructureSpawn.prototype.createLongDistanceHarvester = function (
	energy,
	numberOfWorkParts,
	home,
	target
) {
	// create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
	var body = [];
	for (let i = 0; i < numberOfWorkParts; i++) {
		body.push(WORK);
	}

	// 150 = 100 (cost of WORK) + 50 (cost of MOVE)
	energy -= 150 * numberOfWorkParts;

	var numberOfParts = Math.floor(energy / 100);
	// make sure the creep is not too big (more than 50 parts)
	numberOfParts = Math.min(
		numberOfParts,
		Math.floor((50 - numberOfWorkParts * 2) / 2)
	);
	for (let i = 0; i < numberOfParts; i++) {
		body.push(CARRY);
	}
	for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
		body.push(MOVE);
	}

	// create creep with the created body
	return this.spawnCreep(body, 'LDH' + target + '_' + Game.time, {
		memory: {
			role: 'longDistanceHarvester',
			home: home,
			target: target,
			working: false,
		},
	});
};

// Creep creation functions
// Claim Holder (For reserving controllers)
StructureSpawn.prototype.createClaimHolder = function (target) {
	return this.spawnCreep(
		[CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE],
		'claimHolder' + target + Game.time,
		{ memory: { role: 'claimHolder', target: target, home: this.room.name } }
	);
};

// Claimer (For claiming controllers)
StructureSpawn.prototype.createClaimer = function (target) {
	return this.spawnCreep([CLAIM, MOVE], 'claimer_' + Game.time, {
		memory: { role: 'claimer', target: target, home: this.room.name },
	});
};

// Invader (Basic melee attacker I send in to clear invader
//  cores in rooms I want to claim or reserve)
StructureSpawn.prototype.createInvader = function (target) {
	return this.spawnCreep(
		[
			TOUGH,
			TOUGH,
			TOUGH,
			MOVE,
			MOVE,
			MOVE,
			ATTACK,
			ATTACK,
			MOVE,
			ATTACK,
			MOVE,
			ATTACK,
			ATTACK,
			MOVE,
			MOVE,
			MOVE,
		],
		'invader' + target + '_' + Game.time,
		{ memory: { role: 'invader', target: target, home: this.room.name } }
	);
};

// Remote Constructor (I send this in to rooms I've reserved
//  and am harvesting from to build roads/containers)
StructureSpawn.prototype.createRemoteConstructor = function (target) {
	return this.spawnCreep(
		[MOVE, CARRY, WORK, WORK, CARRY, MOVE],
		'remoteConstructor' + target + '_' + Game.time,
		{
			memory: {
				role: 'remoteConstructor',
				working: false,
				target: target,
				home: this.room.name,
			},
		}
	);
};

// Miner (Spawns automatically once there is a container
//  next to a source in the room)
StructureSpawn.prototype.createMiner = function (sourceId) {
	return this.spawnCreep(
		[WORK, WORK, WORK, WORK, WORK, MOVE],
		'miner_' + Game.time,
		{ memory: { role: 'miner', sourceId: sourceId, home: this.room.name } }
	);
};

// Remote Miner (Spawns automatically if remote mining is
//  enabled and there is no miner already assigned to the target room)
StructureSpawn.prototype.createRemoteMiner = function (roomName, sourceId) {
	return this.spawnCreep(
		[WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
		'remoteMiner_' + Game.time,
		{
			memory: {
				role: 'remoteMiner',
				target: roomName,
				sourceId: sourceId,
				home: this.room.name,
			},
		}
	);
};

// Lorry (Transfers energy from room storage or containers
//  to the various structures what need it)
StructureSpawn.prototype.createLorry = function (energy) {
	// create a body with twice as many CARRY as MOVE parts
	var numberOfParts = Math.floor(energy / 150);
	// make sure the creep is not too big (more than 50 parts)
	numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
	var body = [];
	for (let i = 0; i < numberOfParts * 2; i++) {
		body.push(CARRY);
	}
	for (let i = 0; i < numberOfParts; i++) {
		body.push(MOVE);
	}

	// create creep with the created body and the role 'lorry'
	return this.spawnCreep(body, 'lorry_' + Game.time, {
		memory: { role: 'lorry', working: false, home: this.room.name },
	});
};

// Logistics (Spawns for each miner/source/container combo and transfers
// energy from mines to room storage for easy distribution by the lorries)
StructureSpawn.prototype.createLogistics = function (sourceId) {
	return this.spawnCreep(
		[
			MOVE,
			CARRY,
			CARRY,
			CARRY,
			CARRY,
			CARRY,
			MOVE,
			CARRY,
			CARRY,
			CARRY,
			CARRY,
			CARRY,
			MOVE,
		],
		'logistics_' + Game.time,
		{
			memory: {
				role: 'logistics',
				sourceId: sourceId,
				working: false,
				home: this.room.name,
			},
		}
	);
};

// Create Schlepper (Literally stands between the Target Link and room storage
//  to transfer energy from link to storage as the long dist. harvesters drop it off)
//Mostly deprecated as a standalone creep, but kept as the fallback role for
// the scavenger role
StructureSpawn.prototype.createSchlepper = function () {
	return this.spawnCreep([MOVE, CARRY], 'schlepper_' + Game.time, {
		memory: { role: 'schlepper', working: false, home: this.room.name },
	});
};

// Scavver (Picks up dropped energy on the ground, harvests tombstones and ruins for energy)
StructureSpawn.prototype.createScavenger = function (energy) {
	var numberOfParts = Math.floor(energy / 150);
	numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
	var body = [];
	for (let i = 0; i < numberOfParts * 2; i++) {
		body.push(CARRY);
	}
	for (let i = 0; i < numberOfParts; i++) {
		body.push(MOVE);
	}

	return this.spawnCreep(body, 'scavver_' + Game.time, {
		memory: { role: 'scavenger', working: false, home: this.room.name },
	});
};
