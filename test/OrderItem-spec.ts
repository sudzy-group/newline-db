import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderItem } from "../src/entities/OrderItem";
import { OrderItems } from "../src/collections/OrderItems";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order item test")
class OrderItemTest {

  static db;
  static order_items: OrderItems;

  static before() {
    OrderItemTest.db = new PouchDB("default");
    OrderItemTest.order_items = new OrderItems(OrderItemTest.db, OrderItem);
  }

  static after(done: Function) {
    OrderItemTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
     let order_items = OrderItemTest.order_items;
    expect(order_items.getPrefix()).to.equal("order-item");
  }


//Insert
 @test("should insert order item")
  public testInsertOrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "111",
     dish_id: "1234",
     name: "Chicken",     
     price: 10.00,
     quantity: 1,
     notes: ['separate'],
     tax: 0.00
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("111");
      expect(item.dish_id).to.equal("1234");
      expect(item.price).to.equal(10.00);
      expect(item.quantity).to.equal(1);
      expect(item.notes.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }


 @test("should insert order item with discount")
  public testInsertOrderItemWithDiscount(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "111",
     dish_id: "1234",
     name: "Chicken",     
     price: 10.00,
     quantity: 1,
     notes: ['separate'],
     tax: 0.00,
     discount_id: "4",
     discount_fixed: 2.00,
     is_upcharge: false
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.discount_id).to.equal("4");
      expect(item.discount_fixed).to.equal(2.00);
      expect(item.is_upcharge).to.equal(false);
      done();
    }).catch(m=>console.log(m));
  }


  @test("should insert 3 order items")
  public testInsert3OrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem1Obj = {
     order_id: "222",
     dish_id: "1234",
     name: "Chicken",
     price: 10.00,
     quantity: 1,
     tax: 0.00
   };

   order_items.insert(orderItem1Obj).then((item1) => {
      expect(item1.order_id).to.equal("222");
     let orderItem2Obj = {
     order_id: "222" ,
     dish_id: "2a2a",
     price: 15.40,
     name: "Coke",
     quantity: 3,
     tax: 0.00
   };
   return order_items.insert(orderItem2Obj);
   }).then((item2) => {
      expect(item2.order_id).to.equal("222");
     let orderItem3Obj = {
     order_id: "222" ,
     dish_id: "2a2a",
     price: 4.20,
     name: "Skirts",
     quantity: 1,
     tax: 0.00
   };
   return order_items.insert(orderItem3Obj);
  }).then((item3) => {
     expect(item3.order_id).to.equal("222");
     return order_items.find("order_id", "222");
  }).then((items) => {
      expect(items.length).to.equal(3);
      done();
    }).catch(m=>console.log(m));
  }

//Search
 @test("should search by order id")
  public testSearchOrderId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "333" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };

   order_items.insert(orderItem).then((item) => {
      expect(item.order_id).to.equal("333");
      return order_items.find("order_id", "333");
  }).then((items) => {
      expect(items.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

//Update

 @test("should be able to update with discount")
  public testUpdateDiscount(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "333" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };

   order_items.insert(orderItem).then((item) => {
       let updatedItem = {
      	discount_id: "5",
     	discount_fixed: 2.00,
        is_upcharge: false
       
      }
      return order_items.update(item, updatedItem);
    }).then((updated_item) => {
      expect(updated_item.discount_id).to.equal("5");
      done();
    }).catch(m=>console.log(m));
  }


@test("should not update order_id")
  public testUpdateOrderId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "3a3",
     dish_id: "1234",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.order_id).to.equal("3a3");
      let orderItemUpdated = {
         order_id: "4a4",
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update dish_id")
  public testUpdateItemId(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "55a",
     dish_id: "1234",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.dish_id).to.equal("1234");
      let orderItemUpdated = {
         dish_id: "2234",
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update name")
  public testUpdateName(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "675",
     dish_id: "343",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.dish_id).to.equal("343");
      let orderItemUpdated = {
         name: "Shirt"
      }
      return order_items.update(item, orderItemUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update quantity and price")
  public testUpdateQuantityPrice(done) {
    let order_items = OrderItemTest.order_items;
    let orderItemObj = {
     order_id: "897",
     dish_id: "343",
     price: 10.00,
     name: "Chicken",
     quantity: 5,
     tax: 0.00
   };
   order_items.insert(orderItemObj).then((item) => {
      expect(item.quantity).to.equal(5);
      expect(item.price).to.equal(10.00);
      let orderItemUpdated = {
         price: 20.00,
         quantity: 10
      }
      return order_items.update(item, orderItemUpdated);
  }).then(_.noop)
      .catch((c) => {
        done();
       })
  }

//Delete
  @test("should delete order item")
  public testDeleteOrderItem(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: 1,
     tax: 0.00
   };
   let id = "";

   order_items.insert(orderItem).then((item) => {
      expect(item.order_id).to.equal("444");
      id = item.id;
      return order_items.remove(item);
   }).then((e) => {
      return order_items.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }

//Validators
@test("shouldn't allow negative quantity")
  public testNegativeQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "555" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: -1,
     tax: 0.00
   };
   order_items.insert(orderItem).then(_.noop)
   .catch((c) => {
       done();
   });
  }

  @test("should allow 0 quantity")
  public testZeroQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: 0,
     tax: 0.00
   };
   order_items.insert(orderItem).then((item) => {
      expect(item.quantity).to.equal(0);
      done();
    }).catch(m=>console.log(m));
  }

  
  @test("should allow positive quantity")
  public testPositiveQuantity(done) {
    let order_items = OrderItemTest.order_items;
    let orderItem = {
     order_id: "444" ,
     dish_id: "324",
     price: 10.00,
     name: "Chicken",
     quantity: 10,
     tax: 0.00
   };
   order_items.insert(orderItem).then((item) => {
      expect(item.quantity).to.equal(10);
      done();
    }).catch(m=>console.log(m));
  }


  @test("shouldn't allow dish_id with whitespace")
  public testInvalidDishId(done) {
   let order_items = OrderItemTest.order_items;
   let orderItem = {
     order_id: "444" ,
     dish_id: "3 24",
     price: 10.00,
     name: "Chicken",
     quantity: 10,
     tax: 0.00
   };
   order_items.insert(orderItem).then(_.noop)
      .catch((c) => {
        done();
    });
  }
}

