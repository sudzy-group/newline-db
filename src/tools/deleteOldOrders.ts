import * as PouchDB from "pouchdb";
import * as PouchableAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchableAuthentication);

import * as csv from 'csvtojson';
import { PhoneNumberUtil } from 'google-libphonenumber';

import * as _ from 'lodash';
import Promise from "ts-promise";
import * as mysql from "mysql";

import { Orders } from "../collections/Orders";

import { Order } from "../entities/Order";
import { Database } from '../access/Database';
import * as commander from 'commander';

/**
 * Example: 
 * node lib/tools/deleteCustomer.js --remotePouchDB ****:5984 --remotePouchDBUser *** --remotePouchDBPassword *** --storeId *** --id ***
 */
let p = commander
  .version('0.0.1')
  .usage('[options]')
  .option('-p, --remotePouchDB [value]', 'The remote PouchDB url')
  .option('-U, --remotePouchDBUser [value]', 'The remote PouchDB user')
  .option('-P, --remotePouchDBPassword [value]', 'The remote PouchDB password')
	.option('-s, --storeId [value]', 'The store user')
	.option('-i, --id [value]', 'The customers id')
	.parse(process.argv);

if (!p.remotePouchDB || !p.storeId) {
   console.error('no databases arguments given.');
   process.exit(1);
}

let util = PhoneNumberUtil.getInstance();
let countryCode = "+1";
let region = "US";

var pouch, orders: Orders;

function getConnection() {
  return new PouchDB(p.remotePouchDB + "/" + p.storeId, {
    auth: {
        username: p.storeId,
        password: p.storeId
    }
  });
}

connectPouch( () => {
	console.log('checking if safe delete of ', p.id);
	safeDelete(p.id, order => {
		console.log('safe delete - old order ', order.created_at, order.readable_id, order.is_printed, order.ready_at);
		// orders.remove(order).then(() => {
		// 	console.log('removed');
		// })
	})	
});

function connectPouch(callback) {
	console.log("remote pouch db", p.remotePouchDB);
	var pouch = getConnection();
	orders = new Orders(pouch, Order);
	callback();
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

function format(value) {
	if (!value) { return '' };
	if (value[0] != '+') {
      value = countryCode + value;
	}

	let parsed = util.parse(value, region);
	let formatted = util.format(parsed, 2);
	return formatted;
}

function safeDelete(id, callback) {
  const now = Date.now()
	orders.findByIds(0, now, { limit: 50, skip: 10, descending: true }) // findByIds(1559044383211 + 24 * 60 * 60 * 1000 * 1, 1559044383211 + 24 * 60 * 60 * 1000 * 100, { limit: 40 })
	.then(os => {
		console.log(os.length)
		_.each(os, o => {
			callback(o)
		})
	}).catch(e => console.log(e))
}

// async function  getOrders(orders_db) {
// 	let results = [];
// 	let now = Date.now();
// 	let skip = 0;
// 	let orders = await orders_db.findByIds(0, now, { limit: 50, skip: skip, descending: true });
// 	while (orders.length > 0 && results.length < 50) {
// 		results = _.concat(results, orders);
// 		skip += 50;
// 		if (results.length < 50) {
// 			orders = await orders_db.findByIds(0, now, { limit: 50, skip: skip, descending: true });
// 		}
// 	}
// 	return results;
// }  

