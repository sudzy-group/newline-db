import { suite, test, timeout } from "mocha-typescript";
import * as chai from "chai";
import { Customer } from "../src/entities/Customer";
import { Customers } from "../src/collections/Customers";
import * as PouchDB from "pouchdb";
import * as _ from 'lodash';
import * as metaphone from 'metaphone';

const expect = chai.expect;

@suite("Customer test")
class CustomerTest {

  static db;

  static before() {
    CustomerTest.db = new PouchDB("default");
  }

  static after(done: Function) {
    CustomerTest.db.destroy(() => done());
  }

  @test("should return correct prefix")
  public testPrefix() {
    const customers = new Customers(CustomerTest.db, Customer);
    expect(customers.getPrefix()).to.equal("customer");
  }



  //Insertion  
  @test("should insert customer with token")
  public testInsertMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "242333" }).then((c) => {
      expect(c.token).to.equal("242333");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should insert all parameters")
  public testInsertAll(done) {
    let customerObj = {
      token: "8399232",
      mobile: "19292778399",
      formatted_mobile: '+1(929)277-8399',
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
      payment_customer_id: "cus_9xJOnv9Enc98S"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      return customers.find("mobile", "19292778399")
    }).then((cs) => {
      let c = cs[0];
      _.forIn(customerObj, function(value, key) {
        expect(c[key]).to.equal(value);
      })
      done();
    }).catch(m=>console.log(m));
  }


  @test("should be searchable by token")
  public testSearchToken(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "232568" }).then((c) => {
      return customers.find("token", "232568")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].token).to.equal("232568");
      done();
    }).catch(m=>console.log(m));
  }





  //Search
  @test("should be searchable by mobile")
  public testSearchMobile(done) {
    let t = this;
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "656545", mobile: "6465490562" }).then((c) => {
      return customers.find("mobile", "6465490562")
    }).then((cs) => {
      expect(cs.length).to.equal(1);
      expect(cs[0].mobile).to.equal("6465490562");
      done();
    }).catch(m=>console.log(m));
  }


  @test("should be not found by missing mobile")
  public testSearchMobileNotFound(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "23137", name: "Roy Ganor", mobile: "6465490564" }).then((c) => {
      return customers.find('mobile', '1111111');
    }).then((cs) => {
      expect(cs.length).to.equal(0);
      done();
    }).catch(m=>{
    });
  }  


  @test("should be not found by missing token")
  public testSearchTokenNotFound(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "3578", name: "Roy Ganor", mobile: "6465490500" }).then((c) => {
      return customers.find('token', '4444');
    }).then((cs) => {
      expect(cs.length).to.equal(0);
      done();
    }).catch(m=>{
    });
  } 


 

  //Update
  @test("should update parameters")
  public testUpdate(done) {
    let customerObj = {
      token: "257",
      mobile: "19292778391",
      name: "Mud Park",
      email: "mpark@gmail.com",
      allow_notifications: false,
      payment_customer_id: "cus_9xJOnv9Enc98S"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      _.forIn(customerObj, function(value, key) {
        expect(c[key]).to.equal(value);
      });
      let updatedCustomerObj = {
        name: "Muddy Parks",
        email: "muddyparks@gmail.com",
        allow_notifications: true
      }
      return customers.update(c, updatedCustomerObj);
    }).then((cus) => {
      expect(cus.mobile).to.equal("19292778391");
      expect(cus.name).to.equal("Muddy Parks");
      expect(cus.allow_notifications).to.equal(true);
      done();
    }).catch(m=>console.log(m));
  }

  //Update
  @test("should update parameters 2")
  public testUpdate2(done) {
    let customerObj = {
      token: "2321",
      formatted_mobile: "+1(929)2778391",
      mobile: "19292778391",
      allow_notifications: true,
      name: "Roy Ganor",
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj, new Date().getTime() - 200).then((c) => {
      return customers.find('mobile','19292778391');
    }).then(cs => {
      let c = cs[0];
      let updatedCustomerObj = {
        name: "Roy Ganor1",
        allow_notifications: false
      }
      return customers.update(c, updatedCustomerObj);
    }).then((cus) => {
      expect(cus.name).to.equal("Roy Ganor1");
      expect(cus.allow_notifications).to.equal(false);
      done();
    }).catch((m) => {
      console.log(m);
    });
  }  

  @test("should not update token")
  public testNoMobileUpdate(done) {
    let customerObj = {
      token: "2572",
      mobile: "19292778392",
      name: "Mud Park"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      expect(c.mobile).to.equal("19292778392");
      let updatedCustomerObj = {
        token: "243"
      }
      return customers.update(c, updatedCustomerObj);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }


  //Delete
  @test("should delete customer with just mobile")
  public testDeleteCustomerMobile(done) {
    let id = "";
    let customerObj = {
      token: "535",
      mobile: "19292778387"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      id = c.id;
      return customers.get(id);
    }).then((cus) => {
      return customers.remove(cus);
    }).then((e) => {
      return customers.get(id);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }




  @test("should delete customer with many params")
  public testDeleteCustomerAllParams(done) {
    let id = "";
    let customerObj = {
      token: "665",
      mobile: "19292778388",
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
      payment_customer_id: "cus_9xJOnv9Enc98S"
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      id = c.id;
      return customers.get(id);
    }).then((cus) => {
      return customers.remove(cus);
    }).then((e) => {
      return customers.get(id);
    }).then(_.noop)
      .catch((c) => {
        done();
      });
  }

  // //Validators  
  @test("should not allow invalid mobile")
  public testInvalidMobile(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "64654905" })
      .then(_.noop)
      .catch((c) => {
        done();
      });
  }

  @test("should not allow name with less than 2 characters")
  public testInvalidName(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ mobile: "6165490566", name: "a" })
      .then(_.noop)
      .catch((c) => {
        done();
      });
  }


  @test("should allow valid email")
  public testValidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "2463", mobile: "6465490566", email: "jshmo@gmail.com" }).then((c) => {
      expect(c.email).to.equal("jshmo@gmail.com");
      done();
    }).catch(m=>console.log(m));
  }

  @test("should not allow invalid email")
  public testInvalidEmail(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "646", mobile: "6465490567", email: "jshmo" }).then(_.noop
    ).catch((c) => {
      done();
    });
  }

  @test("shouldn't allow payment_customer_id with whitespace")
  public testInvalidPaymentCustomerId(done) {
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert({ token: "757", mobile: "6165490563", payment_customer_id: "tok 123" }).then(_.noop)
      .catch((c) => {
        done();
      });
  }



  // last name
  @test("should recognize last name")
  public testLastName(done) {
    let customerObj = {
      token: "678",
      mobile: "19292778399",
      formatted_mobile: '+1(929)277-8399',
      name: "Joseph Shmoo",
      email: "joesh@gmail.com",
    }
    const customers = new Customers(CustomerTest.db, Customer);
    customers.insert(customerObj).then((c) => {
      return customers.find("mobile", "19292778399")
    }).then((cs) => {
      let c = cs[0];
      expect(c.lastName("")).to.equal(null);
      expect(c.lastName("Booboo Barr")).to.equal("BR");
      expect(c.lastName("    Booboo Barr    ")).to.equal("BR");
      expect(c.lastName("    Booboo, Barr    ")).to.equal("BR");
      expect(c.lastName("Booboo Barr Babba")).to.equal("BR");
      expect(c.lastName(null)).to.equal(null);
      done();
    }).catch(m=>console.log(m));
  }  
  
}

