import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Order } from "../src/entities/Order";
import { Orders } from "../src/collections/Orders";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';

const expect = chai.expect;

@suite("Order test")
class OrderTest {

  static db;

  static orders: Orders;

  static before() {
    OrderTest.db = new PouchDB("default");
    OrderTest.orders = new Orders(OrderTest.db, Order);
  }

  static after(done: Function) {
    OrderTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    let orders = OrderTest.orders;
    expect(orders.getPrefix()).to.equal("order");
  }

  //Insert
  @test("should insert eat in order")
  public testInsertEatInOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "e5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: false,
     kiosk_id: "2"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.started_at).to.equal(4545444);
      expect(ord.ended_at).to.equal(4545447);
      expect(ord.is_takeout).to.equal(false);
      expect(ord.kiosk_id).to.equal("2");
      expect(ord.readable_id).to.equal("e5d4707d-cd54-bed3-7570-6e9dbec307zz");
      done();
    }).catch(m=>console.log(m));
  }


  @test("should insert takeout order")
  public testInsertTakeoutOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "f5d4707d-cd54-bed3-7570-6e9dbec307ze",
     is_takeout: true,
     kiosk_id: "2"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.started_at).to.equal(4545444);
      expect(ord.ended_at).to.equal(4545447);
      expect(ord.is_takeout).to.equal(true);
      expect(ord.kiosk_id).to.equal("2");
      expect(ord.readable_id).to.equal("f5d4707d-cd54-bed3-7570-6e9dbec307ze");
      done();
    }).catch(m=>console.log(m));
  }



  //Insert
  @test("should insert order full data")
  public testInsertOrderFull(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "g5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "xxx",
     table_id: "1",
     notes: "Pick up quickly", 
     tax: 1.00,
     tip: 3.00,
     discount_fixed: 5.00,
     discount_id: 4
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.started_at).to.equal(4545444);
      expect(ord.ended_at).to.equal(4545447);
      expect(ord.is_takeout).to.equal(true);
      expect(ord.kiosk_id).to.equal("2");
      expect(ord.customer_id).to.equal("xxx");
      expect(ord.notes).to.equal("Pick up quickly");
      expect(ord.readable_id).to.equal("g5d4707d-cd54-bed3-7570-6e9dbec307zz");
      expect(ord.tax).to.equal(1.00);
      expect(ord.tip).to.equal(3.00);
      expect(ord.discount_fixed).to.equal(5.00);
      expect(ord.discount_id).to.equal(4);
      done();
    }).catch(m=>console.log(m));
  }


  @test("should insert order with notes")
  public testInsertOrderNotes(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "h5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "aaa",
     notes: "Pick up quickly"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.notes).to.equal("Pick up quickly");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert order with tax and tip")
  public testInsertOrderPayment(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "i5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     tax: 1.00,
     tip: 3.00
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.tax).to.equal(1.00);
      expect(ord.tip).to.equal(3.00);
      done();
    }).catch(m=>console.log(m));
  }





  //Search
  @test("should search customer id")
  public testSearchCustId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "j5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "bbb"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.customer_id).to.equal("bbb");
      return orders.find("customer_id", ord.customer_id);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

  @test("should search readable_id")
  public testSearchReadableId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "k5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "bbb"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("k5d4707d-cd54-bed3-7570-6e9dbec307zz");
      return orders.find("readable_id", ord.readable_id);
   }).then((ords) => {   
     expect(ords.length).to.equal(1);
      done();
    }).catch(m=>console.log(m));
  }

 






  //Update

  @test("should not update readable_id")
  public testUpdateReadableId(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "l5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "eee",
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("l5d4707d-cd54-bed3-7570-6e9dbec307zz");
      let orderUpdated = {
         readable_id: "92d4707d-cd54-bed3-7570-6e9dbec307zz"
      }
      return orders.update(ord, orderUpdated);
      }).then(_.noop)
      .catch((c) => {
        done();
    });
  }

  @test("should update ready_at")
  public testUpdateReadyAt(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "m5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "eee"
   }
   orders.insert(orderObj).then((ord) => {
      expect(ord.readable_id).to.equal("m5d4707d-cd54-bed3-7570-6e9dbec307zz");
      let orderUpdated = {
         ready_at: 42464644
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.ready_at).to.equal(42464644);
       done();
    }).catch(m=>console.log(m));
  }  

 

  @test("should update note")
  public testUpdateNote(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "n5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "i2i"
   }
   orders.insert(orderObj, new Date().getTime() - 200).then((ord) => {
      let orderUpdated = {
         notes: "Perdy outfit"
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.notes).to.equal("Perdy outfit");
       done();
    }).catch(m=>console.log(m));
  }  

  @test("should update payment info")
  public testUpdatePayment(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "o5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "k2k"
   }
   orders.insert(orderObj).then((ord) => {
      let orderUpdated = {
         tax: 1.00,
         tip: 3.00
      }
      return orders.update(ord, orderUpdated);
     }).then((ordUpdated) => {   
       expect(ordUpdated.tax).to.equal(1.00);
       expect(ordUpdated.tip).to.equal(3.00);
       done();
    }).catch(m=>console.log(m));
  } 


  //Delete
  @test("should delete order")
  public testDeleteOrder(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "p5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "a3a"
   }
   let id = "";
   orders.insert(orderObj).then((ord) => {
      id = ord.id;
      return orders.remove(ord);
   }).then((e) => {
      return orders.get(id);
   }).then(_.noop)
   .catch((c) => {
       done();
   });
  }


  //Validators

  @test("readable id shouldn't have whitespace")
  public testReadableIdWhitespace(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "q5d4 707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     kiosk_id: "2",
     customer_id: "ddd"
   }
   orders.insert(orderObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }


  @test("kiosk id shouldn't have whitespace")
  public testKioskIdWhitespace(done) {
    let orders = OrderTest.orders;
    let orderObj = {
     started_at: 4545444,
     ended_at: 4545447,
     readable_id: "r5d4707d-cd54-bed3-7570-6e9dbec307zz",
     is_takeout: true,
     customer_id: "ddd",
     kiosk_id:"2 4"
   }
   orders.insert(orderObj).then(_.noop)
      .catch((c) => {
        done();
    });
  }

}

