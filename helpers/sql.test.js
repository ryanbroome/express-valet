const { sqlForPartialUpdate } = require("../helpers/sql");
const db = require("../db");

describe("tests sqlForPartialUpdate", function () {
  // Declare variables  for testing
  let userDataToUpdate;
  let jsToSql;
  let badDataToUpdate;
  let badJsToSql;
  let noDataToUpdate;

  beforeEach(async function () {
    // Define variables for testing
    userDataToUpdate = { firstName: "John", lastName: "Smith" };
    badDataToUpdate = { firstName: undefined, lastName: undefined };
    // noDataToUpdate = {};

    jsToSql = { firstName: "first_name", lastName: "last_name" };
    // badJsToSql = { firstName: "", lastName: "" };
  });
  afterAll(async function () {
    await db.end();
  });

  test("works - data present: sqlForPartialUpdate", async function () {
    const { setCols, values } = sqlForPartialUpdate(userDataToUpdate, jsToSql);
    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2');
    expect(values).toEqual(["John", "Smith"]);
  });

  test("fails - missing value data: sqlForPartialUpdate", async function () {
    const { setCols, values } = sqlForPartialUpdate(badDataToUpdate, jsToSql);
    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2');
    expect(values).toEqual([undefined, undefined]);
  });
});
