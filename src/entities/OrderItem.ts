import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { noWhitespace } from '../validators/noWhitespace';
import { amount0OrGreater } from '../validators/amount0OrGreater';

/**
 * Represent a OrderItem entity
 */
export class OrderItem extends Entity {
	
	@EntityField({
        group: "default",
        name: "order_id",
        mandatory: true,
        description: "Order id",
        search_by: [ identity ]  
    })
    public order_id: string;

    @EntityField({
        group: "default",
        name: "dish_id",
        mandatory: true,
        validate: noWhitespace,
        description: "dish_id" 
    })
    public dish_id: string;

    @EntityField({
        group: "default",
        name: "name",
        mandatory: true,
        description: "Item name" 
    })
    public name: string;

    @EntityField({
        group: "default",
        name: "quantity",
        mandatory: true,
        validate: amount0OrGreater,
        description: "Quantity of item" 
    })
    public quantity: number;

    @EntityField({
        group: "default",
        name: "price",
        mandatory: true,
        description: "Total price" 
    })
    public price: number;

    @EntityField({
        group: "default",
        name: "tax",
        mandatory: true,
        description: "Total price" 
    })
    public tax: number;    

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Specific notes about this item" 
    })
    public notes: string[];

    @EntityField({
        group: "discount",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
    public discount_fixed: number;

    @EntityField({
        group: "discount",
        name: "discount_id",
        description: "Discount id applied"
    })
    public discount_id: number;    

    @EntityField({
        group: "upcharge",
        name: "is_upcharge",
        description: "Is upcharge"
    })
    public is_upcharge: boolean;
}