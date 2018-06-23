import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { OrderCharge } from "../src/entities/OrderCharge";
import { OrderCharges } from "../src/collections/OrderCharges";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import Promise from "ts-promise";

const expect = chai.expect;

@suite("Order charge test")
class OrderChargeTest {

  static db;
  static order_charges: OrderCharges;

  static before() {
    OrderChargeTest.db = new PouchDB("default");
    OrderChargeTest.order_charges = new OrderCharges(OrderChargeTest.db, OrderCharge);
  }

  static after(done: Function) {
    OrderChargeTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let order_charges = OrderChargeTest.order_charges;
    expect(order_charges.getPrefix()).to.equal("order-charge");
  }


//Delete
  @test("should delete order charge")
   public testDeleteOrderCharge(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
      order_id: "1",
      amount: 100.00,
      charge_type: "card"
    };
    let id = "";
    order_charges.insert(orderChargeObj).then((charge) => {
      id = charge.id;
      return order_charges.remove(charge);
   }).then((e) => {
      return order_charges.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }
  



  //Insert

  @test("should insert charge")
  public testInsertCharge(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
      order_id: "1",
      amount: 100.00,
      charge_type: "card"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      expect(charge.order_id).to.equal("1");
      expect(charge.amount).to.equal(100.00);
      done();
    }).catch(m=>console.log(m));
  }


  @test("should insert charge with charge id and card id")
  public testInsertCardCharge(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "crd",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      expect(charge.charge_id).to.equal("1212");
      expect(charge.card_id).to.equal("24439aif");
      done();
    }).catch(m=>console.log(m));
  }


//Search
  @test("should be searchable by order id")
  public testSearchOrderId(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "123",
        amount: 100.00,
        charge_type: "crd",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      return order_charges.find("order_id", "123")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].order_id).to.equal("123");
      done();
    }).catch(m=>console.log(m));
  }



//Update
  @test("should update with refund")
  public testRefund(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "crd",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
    let updatedChargeObj = {
        refund_id: "232",
        amount_refunded: 100.00
      }
      return order_charges.update(charge, updatedChargeObj);
     }).then((updated) => {
     	expect(updated.refund_id).to.equal("232");
     	expect(updated.amount_refunded).to.equal(100.00);
        done();
    }).catch((m) => {
      console.log(m);
    });
}



  @test("should not update order_id")
  public testNoOrderIdUpdate(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "crd",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      let updatedChargeObj = {
        order_id: "222"
      }
      return order_charges.update(charge, updatedChargeObj);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }



  @test("should not update amount")
  public testNoAmountUpdate(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "crd",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      let updatedChargeObj = {
        amount: 55.00
      }
      return order_charges.update(charge, updatedChargeObj);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should not update charge type")
  public testNoChargeTypeUpdate(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "card",
        charge_id: '1212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then((charge) => {
      let updatedChargeObj = {
        charge_type: "cash"
      }
      return order_charges.update(charge, updatedChargeObj);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }


  //Validators
  @test("shouldn't allow card_id with whitespace")
  public testInvalidCardId(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "card",
        charge_id: '1212',
        card_id: "24 439aif"
    };
    order_charges.insert(orderChargeObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }


  @test("shouldn't allow charge_id with whitespace")
  public testInvalidChargeId(done) {
    let order_charges = OrderChargeTest.order_charges;
    let orderChargeObj = {
        order_id: "1",
        amount: 100.00,
        charge_type: "card",
        charge_id: '1 212',
        card_id: "24439aif"
    };
    order_charges.insert(orderChargeObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }

}



