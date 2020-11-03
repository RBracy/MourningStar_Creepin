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
	const minPrice = this.memory.sellOrder.minPrice;
	var quantity = this.memory.sellOrder.quantity;

	if (this.memory.sellOrder.quantity == 0) {
		return;
	} else if (
		this.store.getUsedCapacity(RESOURCE_ENERGY) >= 2000 &&
		this.store.getUsedCapacity(saleItem) >= quantity
	) {
		let orders = Game.market.getAllOrders(
			(order) =>
				order.resourceType == saleItem &&
				order.type == ORDER_BUY &&
				Game.market.calcTransactionCost(200, this.room.name, order.roomName) <
					400
		);

		console.log(saleItem + ' buy orders found: ' + orders.length);
		if (orders.length == 0) {
			return;
		}

		orders.sort(function (a, b) {
			return b.price - a.price;
		});
		console.log('Best price: ' + orders[0].price);

		if (orders[0].price >= minPrice) {
			let result = Game.market.deal(orders[0].id, 200, this.room.name);
			if (result == 0) {
				console.log('Order completed successfully');
				this.memory.sellOrder.quantity -= 200;
				return console.log(quantity + ' units remaining in current sell order');
			}
		}
	}
};

StructureTerminal.prototype.marketBuy = function () {
	const purchaseItem = this.memory.purchaseOrder.itemType;
	const maxPrice = this.memory.purchaseOrder.maxPrice;
	var quantity = this.memory.purchaseOrder.quantity;

	if (this.memory.purchaseOrder.quantity == 0) {
		return;
	} else if (
		this.store.getUsedCapacity(RESOURCE_ENERGY) >= 2000 &&
		this.store.getFreeCapacity() >= quantity
	) {
		let orders = Game.market.getAllOrders(
			(order) =>
				order.resourceType == purchaseItem &&
				order.type == ORDER_SELL &&
				Game.market.calcTransactionCost(200, this.room.name, order.roomName) <
					400
		);

		console.log(purchaseItem + ' sell orders found: ' + orders.length);
		if (orders.length == 0) {
			return;
		}

		orders.sort(function (a, b) {
			return a.price - b.price;
		});
		console.log('Best price: ' + orders[0].price);

		if (orders[0].price <= maxPrice) {
			let result = Game.market.deal(orders[0].id, 200, this.room.name);
			if (result == 0) {
				console.log('Order completed successfully');
				this.memory.purchaseOrder.quantity -= 200;
				return console.log(
					quantity + ' units remaining in current purchase order'
				);
			}
		}
	}
};
