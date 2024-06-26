const { BadRequestError } = require("../expressError");

/** Returns Set Columns portion of SQL query string and parameterized values
 * Input  ( { data to update } , { js variable names as keys : SQL column names as values } )
 * ( { dataToUpdate } , { jsToSql } )
 * =>
 * Output
 * { setCols : ` "first_name" : = $1 `, values : [ "John" ] }
 *
 *  EXAMPLE 
 *     const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} // ( $2 )
                      RETURNING username,
                                first_name AS "firstName" 
                                `;
    const result = await db.query(querySql, [...values, username]);
    => result.rows[0] === {username : , firstName : "John"}
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
