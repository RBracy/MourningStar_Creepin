// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('prototype.link');
require('prototype.terminal');

// Upon load or global reset, these loops check for essential memory objects
// and creates blank entries if they don't exist.

for (let room in Game.rooms) {
	if (Game.rooms[room].memory.logisticsEnabled == undefined) {
		Game.rooms[room].memory.logisticsEnabled = false;
	}
	if (Game.rooms[room].memory.linksEnabled == undefined) {
		Game.rooms[room].memory.linksEnabled = false;
	}
	if (Game.rooms[room].memory.remoteMiningEnabled == undefined) {
		Game.rooms[room].memory.remoteMiningEnabled = false;
	}
}

for (let spawnName in Game.spawns) {
	if (Game.spawns[spawnName].memory.minCreeps == undefined) {
		Game.spawns[spawnName].memory.minCreeps = {
			builder: 0,
			extractor: 0,
			giver: 0,
			harvester: 0,
			lorry: 0,
			repairer: 0,
			scavenger: 0,
			schlepper: 0,
			upgrader: 0,
			wallRepaier: 0,
		};
	}
	if (Game.spawns[spawnName].memory.minLongDistanceHarvesters == undefined) {
		Game.spawns[spawnName].memory.minLongDistanceHarvesters = {};
	}
	if (Game.spawns[spawnName].memory.minClaimHolders == undefined) {
		Game.spawns[spawnName].memory.minClaimHolders = {};
	}
	if (Game.spawns[spawnName].memory.minRemoteConstructors == undefined) {
		Game.spawns[spawnName].memory.minRemoteConstructors = {};
	}
	if (Game.spawns[spawnName].memory.minInvaders == undefined) {
		Game.spawns[spawnName].memory.minInvaders = {};
	}
	if (Game.spawns[spawnName].memory.enableHUD == undefined) {
		Game.spawns[spawnName].memory.enableHUD = false;
	}
}
module.exports.loop = function () {
	const tickTock = Memory.tickTock;
	if (tickTock < 5) {
		Memory.tickTock = Memory.tickTock + 1;
	}

	// clear the memory of dead creeps
	for (let name in Memory.creeps) {
		if (Game.creeps[name] == undefined) {
			delete Memory.creeps[name];
		}
	}
	// check the flags
	for (let [name, flag] of Object.entries(Game.flags)) {
		switch (name) {
			case 'InvasionSite':
				Memory.invasionTarget = flag.pos.roomName;
				break;
		}
	}

	// run the links
	var links = _.filter(
		Game.structures,
		(l) => l.structureType == STRUCTURE_LINK
	);
	for (let link of links) {
		link.doWork();
	}

	// run the creeps
	for (let name in Game.creeps) {
		Game.creeps[name].runRole();
	}

	// run the towers
	var towers = _.filter(
		Game.structures,
		(t) => t.structureType == STRUCTURE_TOWER
	);
	for (let tower of towers) {
		tower.runTower();
	}

	// run the spawns
	for (let spawnName in Game.spawns) {
		Game.spawns[spawnName].spawnCreepsIfNecessary();
		Game.spawns[spawnName].headsUpDisplay();
	}

	// run the terminals
	if (Game.time % 6 == 0) {
		var terminals = _.filter(
			Game.structures,
			(t) => t.structureType == STRUCTURE_TERMINAL
		);
		for (let terminal of terminals) {
			terminal.marketSell();
		}
	}
};
