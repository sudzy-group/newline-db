import { Entity, EntityField } from "pouchable";
import { mobile } from "../validators/mobile";
import { lengthGreater1 } from "../validators/lengthGreater1";
import { email } from "../validators/email";
import { zip } from '../validators/zip';
import { latitude } from '../validators/latitude';
import { longitude } from '../validators/longitude';
import { noWhitespace } from '../validators/noWhitespace';
import { identity, toLower, trim } from 'lodash';
import * as metaphone from 'metaphone';

/**
 * Represent a customer entity
 */
export class Customer extends Entity {

    @EntityField({
        group: "default",
        name: "token",
        mandatory: true,
        validate: noWhitespace,
        description: "Customer identifier token (mobile / cc)",
        search_by: [identity]
    })
    public token: string;

    @EntityField({
        group: "contact",
        name: "mobile",
        validate: mobile,
        description: "Customer's mobile phone",
        search_by: [identity]
    })
    public mobile: string;

    @EntityField({
        group: "contact",
        name: "allow_notifications",
        description: "Customer's consent to get email / sms  notifications"
    })
    public allow_notifications: string;

    @EntityField({
        group: "contact",
        name: "formatted_mobile",
        description: "Customer's mobile phone (formatted)"
    })
    public formatted_mobile: string;

    @EntityField({
        group: "name",
        name: "name",
        description: "Customer's name",
        validate: lengthGreater1
    })
    public name: string;

    @EntityField({
        group: "email",
        name: "email",
        validate: email,
        description: "Customer's email"
    })
    public email: string;

    @EntityField({
        group: "payment",
        name: "payment_customer_id",
        validate: noWhitespace,
        description: "Payment customer id"
    })
    public payment_customer_id: string;

    protected last4(mobile) {
        return mobile.substr(-4);
    }

    public lastName(name) {
        name = trim(name);
        let index = name.indexOf(' ');
        if (index == -1) {
            return null;
        }
        index++;
        let lastIndex = name.indexOf(' ', index);
        let last = lastIndex == -1 ? name.substr(index) : name.substr(index, lastIndex - index);
        return metaphone(last);
    }

}
