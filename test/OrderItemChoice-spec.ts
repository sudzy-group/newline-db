import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderItemChoice } from "../src/entities/OrderItemChoice";
import { OrderItemChoices } from "../src/collections/OrderItemChoices";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order item choice test")
class OrderItemChoiceTest {

  static db;
  static order_item_choices: OrderItemChoices;

  static before() {
    OrderItemChoiceTest.db = new PouchDB("default");
    OrderItemChoiceTest.order_item_choices = new OrderItemChoices(OrderItemChoiceTest.db, OrderItemChoice);
  }

  static after(done: Function) {
    OrderItemChoiceTest.db.destroy(() => done());
  }

  // @test("should return correct prefix")
  public testPrefix() {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    expect(order_item_choices.getPrefix()).to.equal("order-item-choices");
  }


//Insert
 @test("should insert order item choice")
  public testInsertOrderItemChoice(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoiceObj = {
     order_item_id: "111",
     choice_id: "1234",
     name: "Spicy",     
     price: 10.00,
     quantity: 1
   };
   order_item_choices.insert(OrderItemChoiceObj).then((item) => {
      expect(item.order_item_id).to.equal("111");
      expect(item.choice_id).to.equal("1234");
      expect(item.price).to.equal(10.00);
      expect(item.quantity).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }



  @test("should insert 3 order item choices")
  public testInsert3OrderItemChoice(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice1Obj = {
     order_item_id: "222",
     choice_id: "1234",
     name: "Spicy",
     price: 10.00,
     quantity: 1
   };

   order_item_choices.insert(OrderItemChoice1Obj).then((item1) => {
     let OrderItemChoice2Obj = {
       order_item_id: "222" ,
       choice_id: "2a2a",
       price: 15.40,
       name: "Coke",
       quantity: 3
   };
   return order_item_choices.insert(OrderItemChoice2Obj);
   }).then((item2) => {
     let OrderItemChoice3Obj = {
       order_item_id: "222" ,
       choice_id: "2a2a",
       price: 4.20,
       name: "Skirts",
       quantity: 1
   };
   return order_item_choices.insert(OrderItemChoice3Obj);
  }).then((item3) => {
     expect(item3.order_item_id).to.equal("222");
     return order_item_choices.find("order_item_id", "222");
  }).then((items) => {
      expect(items.length).to.equal(3);
      done();
    }).catch(m=>console.log(m));
  }

//Search
 @test("should search by order item id")
  public testSearchOrderItemId(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "333" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };

   order_item_choices.insert(OrderItemChoice).then((item) => {
      expect(item.order_item_id).to.equal("333");
      return order_item_choices.find("order_item_id", "333");
  }).then((items) => {
      expect(items.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

//Update

 @test("should be able to update price")
  public testUpdatePrice(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "333" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };

   order_item_choices.insert(OrderItemChoice).then((item) => {
       let updatedItem = {
        price: 5.00
       
      }
      return order_item_choices.update(item, updatedItem);
    }).then((updated_item) => {
      expect(updated_item.price).to.equal(5.00);
      done();
    }).catch(m=>console.log(m));
  }


@test("should not update order_item_id")
  public testUpdateOrderId(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoiceObj = {
     order_item_id: "3a3",
     choice_id: "1234",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };
   order_item_choices.insert(OrderItemChoiceObj).then((item) => {
      expect(item.order_item_id).to.equal("3a3");
      let OrderItemChoiceUpdated = {
         order_item_id: "4a4",
      }
      return order_item_choices.update(item, OrderItemChoiceUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update choice_id")
  public testUpdateItemId(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoiceObj = {
     order_item_id: "55a",
     choice_id: "1234",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };
   order_item_choices.insert(OrderItemChoiceObj).then((item) => {
      expect(item.choice_id).to.equal("1234");
      let OrderItemChoiceUpdated = {
         choice_id: "2234",
      }
      return order_item_choices.update(item, OrderItemChoiceUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update name")
  public testUpdateName(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoiceObj = {
     order_item_id: "675",
     choice_id: "343",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };
   order_item_choices.insert(OrderItemChoiceObj).then((item) => {
      expect(item.choice_id).to.equal("343");
      let OrderItemChoiceUpdated = {
         name: "Shirt"
      }
      return order_item_choices.update(item, OrderItemChoiceUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should not update quantity")
  public testUpdateQuantityPrice(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoiceObj = {
     order_item_id: "897",
     choice_id: "343",
     price: 10.00,
     name: "Spicy",
     quantity: 5
   };
   order_item_choices.insert(OrderItemChoiceObj).then((item) => {
      expect(item.quantity).to.equal(5);
      expect(item.price).to.equal(10.00);
      let OrderItemChoiceUpdated = {
         quantity: 10
      }
      return order_item_choices.update(item, OrderItemChoiceUpdated);
  }).then(_.noop)
      .catch((c) => {
        done();
       })
  }

//Delete
  @test("should delete order item choice")
  public testDeleteOrderItemChoice(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "444" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: 1
   };
   let id = "";

   order_item_choices.insert(OrderItemChoice).then((item) => {
      expect(item.order_item_id).to.equal("444");
      id = item.id;
      return order_item_choices.remove(item);
   }).then((e) => {
      return order_item_choices.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }

//Validators
@test("shouldn't allow negative quantity")
  public testNegativeQuantity(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "555" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: -1
   };
   order_item_choices.insert(OrderItemChoice).then(_.noop)
   .catch((c) => {
       done();
   });
  }

  @test("should allow 0 quantity")
  public testZeroQuantity(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "444" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: 0,
   };
   order_item_choices.insert(OrderItemChoice).then((item) => {
      expect(item.quantity).to.equal(0);
      done();
    }).catch(m=>console.log(m));
  }

  
  @test("should allow positive quantity")
  public testPositiveQuantity(done) {
    let order_item_choices = OrderItemChoiceTest.order_item_choices;
    let OrderItemChoice = {
     order_item_id: "444" ,
     choice_id: "324",
     price: 10.00,
     name: "Spicy",
     quantity: 10
   };
   order_item_choices.insert(OrderItemChoice).then((item) => {
      expect(item.quantity).to.equal(10);
      done();
    }).catch(m=>console.log(m));
  }


  @test("shouldn't allow choice_id with whitespace")
  public testInvalidDishId(done) {
   let order_item_choices = OrderItemChoiceTest.order_item_choices;
   let OrderItemChoice = {
     order_item_id: "444" ,
     choice_id: "3 24",
     price: 10.00,
     name: "Spicy",
     quantity: 10
   };
   order_item_choices.insert(OrderItemChoice).then(_.noop)
      .catch((c) => {
        done();
    });
  }
}

