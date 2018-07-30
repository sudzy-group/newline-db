import { Entity, EntityField } from "pouchable";
import { identity } from 'lodash';
import { noWhitespace } from '../validators/noWhitespace';
/**
 * Represent a Order entity
 */
export class Order extends Entity {

    @EntityField({
        group: "default",
        name: "started_at",
        mandatory: true,
        description: "Started at time",
    })
    public started_at: number;

    @EntityField({
        group: "default",
        name: "ended_at",
        mandatory: true,
        description: "Ended at time",
    })
    public ended_at: number;

    @EntityField({
        group: "default",
        name: "readable_id",
        mandatory: true,
        validate: noWhitespace,
        description: "Human readable id",
        search_by: [ identity ] 
    })
    public readable_id: string;

    @EntityField({
        group: "default",
        mandatory: true,
        name: "is_takeout",
        description: "Is takeout"
    })
    public is_takeout: boolean;    

    @EntityField({
        group: "default",
        name: "kiosk_id",
        mandatory: true,
        validate: noWhitespace,
        description: "Kiosk id"
    })
    public kiosk_id: string;

    @EntityField({
        group: "default",
        name: "subtotal",
        mandatory: true,
        description: "Order subtotal amount"
    })
    public subtotal: number;

    @EntityField({
        group: "default",
        name: "total",
        mandatory: true,
        description: "Order total amount"
    })
    public total: number;

	@EntityField({
        group: "customer",
        name: "customer_id",
        description: "Customer id",
        search_by: [ identity ] 
    })
    public customer_id: string;
    
	@EntityField({
        group: "table",
        name: "table_id",
        description: "Table id",
    })
    public table_id: string;

    @EntityField({
        group: "notes",
        name: "notes",
        description: "Order notes"
    })
    public notes: string;

    @EntityField({
        group: "payment",
        name: "tax",
        description: "Tax"
    })
    public tax: number;

    @EntityField({
        group: "payment",
        name: "tip",
        description: "Tip"
    })
    public tip: number;

    @EntityField({
        group: "payment",
        name: "discount_fixed",
        description: "Discount in dollar amount"
    })
    public discount_fixed: number;

    @EntityField({
        group: "payment",
        name: "discount_id",
        description: "Discount id applied"
    })
    public discount_id: number;

    @EntityField({
        group: "status",
        name: "ready_at",
        description: "Ready at"
    })
    public ready_at: number;
}