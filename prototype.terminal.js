/* this defines a "wrapper" so that our links are able to have a
 *   memory which persists between ticks
 *   Credit to user "joethebarber" in the official Screeps Slack server
 */
Object.defineProperty(StructureTerminal.prototype, 'memory', {
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

StructureTerminal.prototype.marketSell = function () {
	const saleItem = this.memory.sellOrder.itemType;
	var quantity = this.memory.sellOrder.quantity;

	
if (spawn.room.terminal && (Game.time % 10 == 0)) {
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) >= 2000 && this.store.getUsedCapacity(saleItem) >= quantity) {
        var orders = Game.market.getAllOrders(order => order.resourceType == saleItem &&
                                              order.type == ORDER_BUY &&
                                              Game.market.calcTransactionCost(200, spawn.room.name, order.roomName) < 400);
        console.log('Hydrogen buy orders found: ' + orders.length);
        orders.sort(function(a,b){return b.price - a.price;});
        console.log('Best price: ' + orders[0].price);
        if (orders[0].price &gt; 0.7) {
            var result = Game.market.deal(orders[0].id, 200, spawn.room.name);
            if (result == 0) {
                console.log('Order completed successfully');
            }
        }
    }
}
};
