import { Collection } from "pouchable";
import { Order } from "../entities/Order";
import Promise from 'ts-promise';
import { map, sum } from 'lodash';

/**
 * Represents the Orders collection
 */
export class Orders extends Collection<Order> {

    public getPrefix() {
        return "order";
    }
}
