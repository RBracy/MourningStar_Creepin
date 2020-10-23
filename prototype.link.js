/* this defines a "wrapper" so that our links are able to have a
*   memory which persists between ticks
*   Credit to user "joethebarber" in the official Screeps Slack server
*/
Object.defineProperty(StructureLink.prototype, 'memory', {
    get: function() {
        if (!Memory.structures) {
            Memory.structures = {}
        }
        if (!Memory.structures[this.id]) {
            Memory.structures[this.id] = {}
        }
        return Memory.structures[this.id]
    },
    enumerable: false,
    configurable: true,
})


// create a new function for StructureLink
StructureLink.prototype.doWork =
    function () {
        let targetLink = this.room.find(FIND_STRUCTURES, {
            filter: (link) => link.structureType == STRUCTURE_LINK && 
                link.memory.target == true
        });
        if (this.memory.source == true) {
            if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.transferEnergy(targetLink[0]);
            }
        }
    };