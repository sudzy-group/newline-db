import { Collection } from "pouchable";
import { OrderItemChoice } from "../entities/OrderItemChoice";

/**
 * Represents the Order Item Choices collection
 */
export class OrderItemChoices extends Collection<OrderItemChoice> {

    public getPrefix() {
        return "oic";
    }

}
