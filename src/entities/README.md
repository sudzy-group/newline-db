# Customer
| Field Name          | Field Type | Group   | Description                                          | Comments              |
| ------------------- | ---------- | ------- | ---------------------------------------------------- | --------------------- |
| id                  | `string`   | default | Entity id                                            | Auto-generated        |
| created_at          | `number`   | default | Creation datetime (unix)                             | Auto-generated        |
| token               | `string`   | default | Customer identifier token (mobile / cc)              | Validated, Searchable |
| mobile              | `string`   | contact | Customer's mobile phone                              | Validated, Searchable |
| allow_notifications | `string`   | contact | Customer's consent to get email / sms  notifications |                       |
| formatted_mobile    | `string`   | contact | Customer's mobile phone (formatted)                  |                       |
| name                | `string`   | name    | Customer's name                                      | Validated             |
| email               | `string`   | email   | Customer's email                                     | Validated             |
| payment_customer_id | `string`   | payment | Payment customer id                                  | Validated             |
# CustomerCard
| Field Name   | Field Type | Group    | Description                     | Comments       |
| ------------ | ---------- | -------- | ------------------------------- | -------------- |
| id           | `string`   | default  | Entity id                       | Auto-generated |
| created_at   | `number`   | default  | Creation datetime (unix)        | Auto-generated |
| customer_id  | `string`   | default  | Customer id                     | Searchable     |
| card_id      | `string`   | default  | Card id                         | Validated      |
| brand        | `string`   | default  | Card brand                      | Validated      |
| last4        | `string`   | default  | Last 4 digits of card           | Validated      |
| exp_month    | `string`   | default  | Expiration month                |                |
| exp_year     | `string`   | default  | Expiration year                 | Validated      |
| is_default   | `boolean`  | settings | Whether card is default         |                |
| is_forgotten | `boolean`  | settings | Whether card is hidden          |                |
| card_token   | `string`   | settings | token of the card in the system |                |
# CustomerCredit
| Field Name     | Field Type | Group   | Description                                                              | Comments       |
| -------------- | ---------- | ------- | ------------------------------------------------------------------------ | -------------- |
| id             | `string`   | default | Entity id                                                                | Auto-generated |
| created_at     | `number`   | default | Creation datetime (unix)                                                 | Auto-generated |
| customer_id    | `string`   | default | Customer id                                                              | Searchable     |
| original       | `number`   | default | Original credit                                                          |                |
| reason         | `number`   | default | Reason: 1-Missing item 2-Damaged 3-Gift card 4-Promotion 5-Billing error |                |
| description    | `string`   | default | Description of this credit                                               |                |
| employee_id    | `string`   | default | Employee id that created this credit                                     |                |
| payment_method | `string`   | default | Payment description of this credit                                       |                |
| payment_id     | `string`   | default | Payment id of this credit (usually the transaction id)                   |                |
| balance        | `number`   | balance | Balance of the credit                                                    |                |
# CustomerCoupon
| Field Name  | Field Type | Group   | Description                  | Comments       |
| ----------- | ---------- | ------- | ---------------------------- | -------------- |
| id          | `string`   | default | Entity id                    | Auto-generated |
| created_at  | `number`   | default | Creation datetime (unix)     | Auto-generated |
| customer_id | `string`   | default | Customer id                  | Searchable     |
| coupon_id   | `number`   | default | Coupon id used in this order |                |
| order_id    | `string`   | default | Order id using the coupon    |                |
# Order
| Field Name     | Field Type | Group    | Description               | Comments              |
| -------------- | ---------- | -------- | ------------------------- | --------------------- |
| id             | `string`   | default  | Entity id                 | Auto-generated        |
| created_at     | `number`   | default  | Creation datetime (unix)  | Auto-generated        |
| started_at     | `number`   | default  | Started at time           |                       |
| ended_at       | `number`   | default  | Ended at time             |                       |
| readable_id    | `string`   | default  | Human readable id         | Validated, Searchable |
| is_takeout     | `boolean`  | default  | Is takeout                |                       |
| kiosk_id       | `string`   | default  | Kiosk id                  | Validated             |
| subtotal       | `number`   | default  | Order subtotal amount     |                       |
| total          | `number`   | default  | Order total amount        |                       |
| customer_id    | `string`   | customer | Customer id               | Searchable            |
| table_id       | `string`   | table    | Table id                  |                       |
| notes          | `string`   | notes    | Order notes               |                       |
| tax            | `number`   | payment  | Tax                       |                       |
| tip            | `number`   | payment  | Tip                       |                       |
| discount_fixed | `number`   | payment  | Discount in dollar amount |                       |
| discount_id    | `number`   | payment  | Discount id applied       |                       |
| ready_at       | `number`   | status   | Ready at                  |                       |
# OrderItem
| Field Name     | Field Type | Group    | Description                    | Comments       |
| -------------- | ---------- | -------- | ------------------------------ | -------------- |
| id             | `string`   | default  | Entity id                      | Auto-generated |
| created_at     | `number`   | default  | Creation datetime (unix)       | Auto-generated |
| order_id       | `string`   | default  | Order id                       | Searchable     |
| dish_id        | `string`   | default  | dish_id                        | Validated      |
| name           | `string`   | default  | Item name                      |                |
| quantity       | `number`   | default  | Quantity of item               | Validated      |
| price          | `number`   | default  | Total price                    |                |
| tax            | `number`   | default  | Total price                    |                |
| notes          | `string[]` | notes    | Specific notes about this item |                |
| discount_fixed | `number`   | discount | Discount in dollar amount      |                |
| discount_id    | `number`   | discount | Discount id applied            |                |
| is_upcharge    | `boolean`  | upcharge | Is upcharge                    |                |
# OrderItemChoice
| Field Name    | Field Type | Group   | Description              | Comments       |
| ------------- | ---------- | ------- | ------------------------ | -------------- |
| id            | `string`   | default | Entity id                | Auto-generated |
| created_at    | `number`   | default | Creation datetime (unix) | Auto-generated |
| order_item_id | `string`   | default | Order item id            | Searchable     |
| choice_id     | `string`   | default | choice_id                | Validated      |
| name          | `string`   | default | choice name              |                |
| quantity      | `number`   | default | Quantity of choice       | Validated      |
| price         | `number`   | price   | extra price              |                |
# OrderCharge
| Field Name      | Field Type | Group   | Description                        | Comments       |
| --------------- | ---------- | ------- | ---------------------------------- | -------------- |
| id              | `string`   | default | Entity id                          | Auto-generated |
| created_at      | `number`   | default | Creation datetime (unix)           | Auto-generated |
| order_id        | `string`   | default | Order id                           | Searchable     |
| amount          | `number`   | default | Amount charged                     |                |
| charge_type     | `string`   | default | Charge type of cash, credit, other |                |
| charge_id       | `string`   | card    | Charge id                          | Validated      |
| card_id         | `string`   | card    | Card id                            | Validated      |
| date_cash       | `string`   | cash    | date of cash receieved             | Searchable     |
| refund_id       | `string`   | refund  | Refund id                          |                |
| amount_refunded | `number`   | refund  | Amount refunded                    |                |
# Timeline
| Field Name  | Field Type | Group   | Description                       | Comments       |
| ----------- | ---------- | ------- | --------------------------------- | -------------- |
| id          | `string`   | default | Entity id                         | Auto-generated |
| created_at  | `number`   | default | Creation datetime (unix)          | Auto-generated |
| employee_id | `string`   | default | Employee ID                       |                |
| operation   | `number`   | default | Operation code                    |                |
| order_id    | `string`   | default | Order id related to the operation | Searchable     |
| text        | `string`   | default | Text of the event                 |                |
# Message
| Field Name | Field Type | Group   | Description                       | Comments       |
| ---------- | ---------- | ------- | --------------------------------- | -------------- |
| id         | `string`   | default | Entity id                         | Auto-generated |
| created_at | `number`   | default | Creation datetime (unix)          | Auto-generated |
| group_id   | `string`   | default | Group ID, customer's phone number | Searchable     |
| group_name | `string`   | default | Group name, customer's name       |                |
| sender     | `string`   | default | Sender's mobile number            |                |
| body       | `string`   | default | Message body                      |                |
| is_me      | `boolean`  | default | Is me (business)                  |                |
| is_unread  | `boolean`  | unread  | Is message unread                 | Searchable     |
