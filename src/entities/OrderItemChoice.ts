import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { noWhitespace } from '../validators/noWhitespace';
import { amount0OrGreater } from '../validators/amount0OrGreater';

/**
 * Represent a OrderItem entity
 */
export class OrderItemChoice extends Entity {
	
	@EntityField({
        group: "default",
        name: "order_item_id",
        mandatory: true,
        description: "Order item id",
        search_by: [ identity ]  
    })
    public order_item_id: string;

    @EntityField({
        group: "default",
        name: "choice_id",
        mandatory: true,
        validate: noWhitespace,
        description: "choice_id" 
    })
    public choice_id: string;

    @EntityField({
        group: "default",
        name: "name",
        mandatory: true,
        description: "choice name" 
    })
    public name: string;

    @EntityField({
        group: "default",
        name: "quantity",
        mandatory: true,
        validate: amount0OrGreater,
        description: "Quantity of choice" 
    })
    public quantity: number;

    @EntityField({
        group: "price",
        name: "price",
        description: "extra price" 
    })
    public price: number;
}