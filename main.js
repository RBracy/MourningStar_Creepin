// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('prototype.link');
require('prototype.terminal');
require('prototype.lab');

// Global constants
const links = _.filter(
	Game.structures,
	(l) => l.structureType == STRUCTURE_LINK
);
const towers = _.filter(
	Game.structures,
	(t) => t.structureType == STRUCTURE_TOWER
);
const terminals = _.filter(
	Game.structures,
	(t) => t.structureType == STRUCTURE_TERMINAL
);
const labs = _.filter(Game.structures, (l) => l.structureType == STRUCTURE_LAB);

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
			builder: 1,
			defender: 1,
			extractor: 0,
			giver: 0,
			harvester: 2,
			lorry: 0,
			repairer: 0,
			scavenger: 0,
			schlepper: 0,
			upgrader: 2,
			wallRepairer: 0,
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

for (let link of links) {
	if (link.memory.source == undefined) {
		link.memory.source = false;
	}
	if (link.memory.target == undefined) {
		link.memory.target = false;
	}
}

for (let tower of towers) {
	if (tower.memory.repairEnabled == undefined) {
		tower.memory.repairEnabled = false;
	}
}

for (let terminal of terminals) {
	if (terminal.memory.requisitions == undefined) {
		terminal.memory.requisitions = {
			H: 0,
			O: 0,
			U: 0,
			L: 0,
			K: 0,
			Z: 0,
			X: 0,
			G: 0,
			silicon: 0,
			metal: 0,
			biomass: 0,
			mist: 0,
			energy: 2000,
			power: 0,
		};
	}
	if (terminal.memory.sellOrder == undefined) {
		terminal.memory.sellOrder = {
			itemType: '',
			minPrice: 0,
			quantity: 0,
		};
	}
	if (terminal.memory.purchaseOrder == undefined) {
		terminal.memory.purchaseOrder = {
			itemType: '',
			maxPrice: 0,
			quantity: 0,
		};
	}
}

for (let lab of labs) {
	if (lab.memory.enabled == undefined) {
		lab.memory.enabled = false;
	}
}

module.exports.loop = function () {
	// Global constants
	const links = _.filter(
		Game.structures,
		(l) => l.structureType == STRUCTURE_LINK
	);
	const towers = _.filter(
		Game.structures,
		(t) => t.structureType == STRUCTURE_TOWER
	);
	const terminals = _.filter(
		Game.structures,
		(t) => t.structureType == STRUCTURE_TERMINAL
	);
	const labs = _.filter(
		Game.structures,
		(l) => l.structureType == STRUCTURE_LAB
	);
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
	for (let link of links) {
		link.doWork();
	}

	// run the creeps
	for (let name in Game.creeps) {
		Game.creeps[name].runRole();
	}

	// run the towers
	for (let tower of towers) {
		tower.runTower();
	}

	// run the spawns
	for (let spawnName in Game.spawns) {
		Game.spawns[spawnName].spawnCreepsIfNecessary();
		Game.spawns[spawnName].headsUpDisplay();
	}

	// run the terminals
	if (Game.time % 6 === 0) {
		for (let terminal of terminals) {
			terminal.marketSell();
			terminal.marketBuy();
		}
	}

	// run the labs
	for (let lab of labs) {
		lab.doScience();
	}
};
