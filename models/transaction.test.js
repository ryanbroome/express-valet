"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Transaction = require("./transaction.js");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("Transaction: create Transaction", function () {
  const newTransaction = {
    userId: 1,
    vehicleId: 1,
    locationId: 1,
  };
  // todo LeftOffHere
  test("Transaction: works", async function () {
    let transaction = await Transaction.create(newTransaction);
    expect(transaction).toEqual(newTransaction);

    const result = await db.query(
      `SELECT 
          user_id AS "userId",
          vehicle_id AS "vehicleId",
          location_id AS "locationId"
      FROM
          locations
      WHERE 
          id = $1`,
      [transaction.data.id]
    );

    expect(result.rows).toEqual([
      {
        userId: 1,
        vehicleId: 1,
        locationId: 1,
      },
    ]);
  });

  test("Transaction: bad request with dupe", async function () {
    try {
      await Transaction.create(newCompany);
      await Transaction.create(newCompany);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("Transaction: findAll", function () {
  test("Transaction works: no filter", async function () {
    let transactions = await Company.findAll();
    expect(transactions).toEqual([
      {
        userId: 1,
        vehicleId: 1,
        locationId: 1,
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
});

/************************************** findPartial */
describe("GET transaction by partial mobile", function () {
  test("Transaction: works: filter", async function () {
    let transactions = await Transaction.getPartial("1");
    expect(transactions).toEqual([{ userId: 1, vehicleId: 1, locationId: 1 }]);
  });
  test("Transaction: bad request Not Found Error: filter", async function () {
    try {
      let transactions = await Transaction.getPartial("4");
      expect(transactions.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findNameMin */
describe("GET transactinos by partial mobile + min employees", function () {
  test("works: filter", async function () {
    let companies = await Company.getNameMin("C", 2);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
  test("bad request Not Found Error: filter", async function () {
    try {
      let companies = await Company.getNameMin("D", 4);
      expect(companies.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** findNameMax */
describe("GET companies by partial name + max employees", function () {
  test("works: filter", async function () {
    let companies = await Company.getNameMax("C", 2);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });
  test("bad request Not Found Error: filter", async function () {
    try {
      let companies = await Company.getNameMax("D", 4);
      expect(companies.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getMinCompanies */
describe("GET companies with min employees", function () {
  test("works: filter", async function () {
    let companies = await Company.getMinCompanies(2);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
  test("bad request Not Found Error: filter", async function () {
    try {
      let companies = await Company.getMinCompanies(4);
      expect(companies.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getMaxCompanies */
describe("GET companies with max employees", function () {
  test("works: filter", async function () {
    let companies = await Company.getMaxCompanies(2);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });
  test("bad request Not Found Error: filter", async function () {
    try {
      let companies = await Company.getMaxCompanies(-1);
      expect(companies.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getRangeCompanies */
describe("GET companies with range (min - max) employees", function () {
  test("works: filter", async function () {
    let companies = await Company.range(1, 2);
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    ]);
  });
  test("bad request Not Found Error: filter", async function () {
    try {
      let companies = await Company.range(4, 6);
      expect(companies.length).toEqual(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getFullSort */
describe("GET companies with partial name & range (min-max) employees", function () {
  test("works", async function () {
    let companies = await Company.fullSort("C", 2, 3);
    expect(companies).toEqual([
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        numEmployees: 3,
        logoUrl: "http://c3.img",
      },
    ]);
  });
  test("bad request , no data found", async function () {
    try {
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let company = await Company.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: 10,
        logo_url: "http://new.img",
      },
    ]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null,
    };

    let company = await Company.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`
    );
    expect(result.rows).toEqual([
      {
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: null,
        logo_url: null,
      },
    ]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Company.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Company.remove("c1");
    const res = await db.query("SELECT handle FROM companies WHERE handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Company.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
