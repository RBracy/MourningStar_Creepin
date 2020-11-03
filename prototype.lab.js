/* this defines a "wrapper" so that our links are able to have a
 *   memory which persists between ticks
 *   Credit to user "joethebarber" in the official Screeps Slack server
 */
Object.defineProperty(StructureLab.prototype, 'memory', {
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

// create a new function for StructureLink
StructureLab.prototype.doWork = function () {
	// Stuff will go in here to make the labs do what they do, eventually.
};
