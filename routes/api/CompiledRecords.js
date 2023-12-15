var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var databaseConn = require ('../../config/database.js');

//SELECT
//routes get api/account/view
//@desc can view data
//@access PUBLIC
router.get('/view', (req, res) => {
    const jwToken = req.cookies.jwToken;

    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }

    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);

        const decodedClient_ID = decodedToken.data.ClientID;
        const sqlQuery = `SELECT * FROM compiled_records`;

        databaseConn.query(sqlQuery, (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Error fetching data from the table.");
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        console.log('Error verifying JWT token', error); // Log the error
        return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
    }
});



//ADD
//adding data
router.post('/add',(req,res) => {
 const jwToken = req.cookies.jwToken;
 
  if (!jwToken) {
      console.log('JWT token not found in the cookie'); // Log the error
      return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
  }
 
  try {
      console.log('Verifying JWT token'); // Log the start of the token verification
      const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
 
      const decodedClient_ID = decodedToken.data.ClientID;

    sqlQuery = `INSERT INTO compiled_records (Customer_ID, Order_ID, SpecialOrder_ID, Payment_ID, Date_of_payment)
    SELECT
        acc_records.Customer_ID,
        order_records.Order_ID,
        specialo_records.SpecialOrder_ID,
        payment_records.Payment_ID,
        payment_records.Date_of_payment
    FROM
        acc_records
    LEFT JOIN
        order_records ON acc_records.Customer_ID = order_records.Customer_ID
    LEFT JOIN
        specialo_records ON acc_records.Customer_ID = specialo_records.Customer_ID
    LEFT JOIN
        payment_records ON acc_records.Customer_ID = payment_records.Customer_ID;
`;
    databaseConn.query (sqlQuery, function(error,results,fields){
       if(error) throw error;
       res.status(200).json(results)
    })} catch (error) {
        console.log('Error verifying JWT token', error); // Log the error
        return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
    }
});

module.exports = router;