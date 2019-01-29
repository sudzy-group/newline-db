#!/usr/bin/env node

import * as PouchDB from 'pouchdb';
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as _ from 'lodash';
import * as mysql from 'mysql';
import Promise from 'ts-promise';
import * as async from 'async';

import { Orders } from "../collections/Orders";
import { OrderItems } from "../collections/OrderItems";
import { OrderItemChoices } from "../collections/OrderItemChoices";

import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderItemChoice } from "../entities/OrderItemChoice";

import * as commander from 'commander';

const SKIP_INTERVAL = 500;

let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
  .option('-h, --remoteMySQLHost [value]', 'The remote MySQL Host argument')
	.option('-u, --remoteMySQLUser [value]', 'The remote MySQL User argument')
	.option('-w, --remoteMySQLPassword [value]', 'The remote MySQL Password argument')
	.option('-d, --remoteMySQLDatabase [value]', 'The remote MySQL Database argument')
	.option('-s, --storeId [value]', 'The store id argument')
	.parse(process.argv);


if (!p.remotePouchDB || !p.remoteMySQLHost || !p.remoteMySQLUser ||!p.remoteMySQLDatabase || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

var pouch;
var orders, order_items, order_item_choices;
var SQLconnection;

connectPouch();
connectSQL();

const userId = p.storeId.substr('newline'.length)

function connectPouch() {
	console.log("remote pouch db", p.remotePouchDB);
	pouch = new PouchDB(p.remotePouchDB, {
		auth: {
				username: p.remotePouchDBUser,
				password: p.remotePouchDBPassword
		}
	});

	orders = new Orders(pouch, Order);
	order_items = new OrderItems(pouch, OrderItem);
	order_item_choices = new OrderItemChoices(pouch, OrderItemChoice);
}

function connectSQL() {
	console.log('connectSQL')
	let connection = {
		host: p.remoteMySQLHost,
		user: p.remoteMySQLUser,
		password: _.isString(p.remoteMySQLPassword) ? p.remoteMySQLPassword : '',
		database: p.remoteMySQLDatabase,
		multipleStatements: true
	}
	console.log(connection)
	SQLconnection = mysql.createConnection(connection);

	SQLconnection.connect(function(err) {
		if (err) {
			console.error('error connecting to mysql: ' + err.stack);
			return;
		}
		console.log('connected to mysql');
		copyPouchToSQL();
	});
}


function copyPouchToSQL() {

	/////////////////////
	// Customers
	/////////////////////
	pouch.info().then(function(info) {
		console.log(info)
		return extract(orders, "customer_id", ordersConvertor, ordersConvertorFields, 'Orders');
	}).then(() => {
		return extract(order_items, "order_id", orderItemsConvertor, orderItemsConvertorFields, 'OrderItems');
	}).then(() => {
		return extract(order_item_choices, "order_item_id", orderItemChoicesConvertor, orderItemChoicesConvertorFields, 'OrderItemChoices');
	}).then(() => {
		console.log("Disconnecting");
		disconnectSQL();
	}).catch(m => {
		console.log(m);
		disconnectSQL(1);
	});
}

function extract(collection, field, convertor, convertoFields, keyName, filterFunction?) {
	console.log('extracting ' + keyName);
	return new Promise((resolve, reject) => {
		collection.findIds(field, "", { startsWith: true }).then(ids => {
			let l = ids.length;
			let sorted = _.map(ids, 'id');
			sorted.sort(function(a, b){return b>a});
			console.log('total to convert' , l, keyName);
			let skip = 0;
			let ps = [];
			while (l > 0) {
				let find = _.partialRight((callback, skip) => {
					let toLoad = [];
					let values = sorted.splice(0, SKIP_INTERVAL);
					values.forEach(value => {
						toLoad.push(collection.get(value));	
					});
					Promise.all(toLoad).then(result => { 
						console.log('converting...', result.length);
						if (filterFunction) {
							result = _.filter(result, filterFunction);
						}
						return insertAll(result, convertor, convertoFields, keyName);
					}).then((r) => {
						callback(null, r);
					}).catch(m=> {
						console.log('error converting...');
						callback(m)
					});						
				}, skip)
				ps.push(find);
				skip += SKIP_INTERVAL;
				l -= SKIP_INTERVAL;
			}
			async.series(ps, (err, results) => {
				if (err) {
					console.log(err);
				}
				return resolve(results);
			})

		}).catch(reject);
	});
}

function disconnectSQL(status = 0) {
	SQLconnection.destroy();
	process.exit(status);
};

function insertAll(es, convertor, convertoFields, tableName) {
	console.log("Preparing conversion of " + tableName + ".");
	console.log("Entities to convert: ", es.length);

	if (es.length == 0) {
		return Promise.resolve([]);
	}

	let inserts = [];
	_.each(es, e => {
		inserts.push(convertor(e));
	})
	
	return new Promise((resolve, reject) => {
		let query = 'INSERT INTO ' + tableName +' (' + convertoFields().join(',') + ') VALUES ?';
		let q = SQLconnection.query(query, [inserts], function(error, results, fields) {
			if (error) {
				console.log(error);
			}
			resolve(results);
		});
	})

}

function ordersConvertorFields() {
	return [ "originalId", "userId", "createdAt", "startedAt", "endedAt", "readableId", "isTakeout", "kioskId", "subtotal", "total", "customerId", "tableId", "notes", "tax", "tip", "discountFixed", "discountId", "readyAt", "isPrinted" ];
}

function ordersConvertor(order: Order) {
	return [
		order.id,
		userId,
		order.created_at,
		order.started_at,
		order.ended_at,
		order.readable_id,
		order.is_takeout,
		order.kiosk_id,
		order.subtotal,
		order.total,
		order.customer_id,
		order.table_id,
		toString(order.notes),
		order.tax,
		order.tip,
		order.discount_fixed,
		order.discount_id,
		order.ready_at,
		order.is_printed,
	]
}

function orderItemsConvertorFields() {
	return [ "originalId", "userId", "createdAt", "orderId", "dishId", "name", "quantity", "price", "tax", "notes", "discountFixed", "discountId", "isUpcharge" ];
}

function orderItemsConvertor(order_item: OrderItem) {
	return [
		order_item.id,
		userId,
		order_item.created_at,
		order_item.order_id,
		order_item.dish_id,
		order_item.name,
		order_item.quantity,
		order_item.price,
		order_item.tax,
		toString(order_item.notes),
		order_item.discount_fixed,
		order_item.discount_id,
		order_item.is_upcharge
	]
}

function orderItemChoicesConvertorFields() {
	return [ "originalId", "userId", "createdAt", "orderItemId", "choiceId", "name", "quantity", "price" ];
}

function orderItemChoicesConvertor(order_item: OrderItemChoice) {
	return [
		order_item.id,
		userId,
		order_item.created_at,
		order_item.order_item_id,
		order_item.choice_id,
		order_item.name,
		order_item.quantity,
		order_item.price,
	]
}

function toString(val) {
	if (!val) {
		return null;
	}
	if (_.isString(val)) {
		return val;
	}
	if (_.isArray(val)) {
		return val.join(', ');
	}
}
