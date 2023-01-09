//test for companies

const require = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

//solution claims to clean out data, is this a common practice? need to review
beforeEach(createData);

afterAll(async () => {

    await db.end() //is this common syntax?
})

describe("GET /", () => { //should start with describe for jest test

    test("It should respond with array of companies", async function () { //the function purpose
        const resonse = await requestAnimationFrame(app).get("/companies");
        expect(response.body).toEqual({
            "companies": [
                {code: "apple", name: "Apple"},
                {code: "ibm", name: "IBM"},
            ]
        });
    })
})

describe("GET /apple", function () {

    test("It returns company info", async function () {
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual({
            "company": {
                code: "apple",
                name: "Apple",
                description: "maker of OSX.",
                invoices: [1, 2],
            }
        })
    });
    
    test("it should return 404 for no-such-company", async function (){
        const response = await request(app).get("/companies/jadgd");
        expect(response.status).toEqual(404);
    })
});

describe("POST /", function () {

    test("It should add company", async function () {
      const response = await request(app)
          .post("/companies")
          .send({name: "TacoTime", description: "Yum!"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "tacotime",
              name: "TacoTime",
              description: "Yum!",
            }
          }
      );
    });
  
    test("It should return 500 for conflict", async function () {
      const response = await request(app)
          .post("/companies")
          .send({name: "Apple", description: "Huh?"});
  
      expect(response.status).toEqual(500);
    })
  });
  
  
  describe("PUT /", function () {
  
    test("It should update company", async function () {
      const response = await request(app)
          .put("/companies/apple")
          .send({name: "AppleEdit", description: "NewDescrip"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "apple",
              name: "AppleEdit",
              description: "NewDescrip",
            }
          }
      );
    });
  
    test("It should return 404 for no-such-comp", async function () {
      const response = await request(app)
          .put("/companies/blargh")
          .send({name: "Blargh"});
  
      expect(response.status).toEqual(404);
    });
  
    test("It should return 500 for missing data", async function () {
      const response = await request(app)
          .put("/companies/apple")
          .send({});
  
      expect(response.status).toEqual(500);
    })
  });
  
  
  describe("DELETE /", function () {
  
    test("It should delete company", async function () {
      const response = await request(app)
          .delete("/companies/apple");
  
      expect(response.body).toEqual({"status": "deleted"});
    });
  
    test("It should return 404 for no-such-comp", async function () {
      const response = await request(app)
          .delete("/companies/blargh");
  
      expect(response.status).toEqual(404);
    });
  });
  