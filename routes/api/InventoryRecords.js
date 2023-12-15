var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var databaseConn = require ('../../config/database.js');


//ADD
router.post('/add', (req, res) => {
    const jwToken = req.cookies.jwToken;
 
    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }
   
    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
   
        const decodedClient_ID = decodedToken.data.ClientID;
        const insertQuery = `
            INSERT INTO inventoro_records (Customer_ID, Order_ID, SpecialOrder_ID, S_product_name, S_date, Product_decs, O_product_name, O_date, Product_price)
            SELECT acc_records.Customer_ID, order_records.Order_ID, specialo_records.SpecialOrder_ID, specialo_records.S_product_name, specialo_records.S_date, specialo_records.Product_decs, order_records.O_product_name, order_records.O_date, order_records.Product_price
            FROM acc_records
            LEFT JOIN order_records ON acc_records.Customer_ID = order_records.Customer_ID
            LEFT JOIN specialo_records ON acc_records.Customer_ID = specialo_records.Customer_ID;
        `;

        databaseConn.query(insertQuery, (error, results, fields) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Error inserting data into the new table.");
            } else {
                res.status(200).json({ message: "Data inserted into the new table successfully." });
            }
        });
    } catch (error) {
        console.log('Error verifying JWT token', error); // Log the error
        return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
    }
});

//SELECT
//routes get api/account/view
//@desc can view data
//@access PUBLIC
router.get('/view',(req,res) => {
    const jwToken = req.cookies.jwToken;
 
    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }
   
    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
   
        const decodedClient_ID = decodedToken.data.ClientID;
    const sqlQuery = `SELECT acc_records.Customer_ID, order_records.Order_ID, specialo_records.SpecialOrder_ID, specialo_records.S_product_name, 
    specialo_records.S_date, specialo_records.Product_decs, order_records.O_product_name, order_records.O_date, order_records.Product_price 
    FROM acc_records LEFT JOIN order_records ON acc_records.Customer_ID = order_records.Customer_ID 
    LEFT JOIN specialo_records ON acc_records.Customer_ID = specialo_records.Customer_ID;`;
    databaseConn.query (sqlQuery, function(error,results,fields){
       if(error) throw error;
       res.status(200).json(results)
    })} catch (error) {
        console.log('Error verifying JWT token', error); // Log the error
        return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
    }
});
 
module.exports = router;