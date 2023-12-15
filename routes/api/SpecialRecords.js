var express = require('express');
var router = express.Router();
var databaseConn = require ('../../config/database.js');
const jwt = require('jsonwebtoken');

//Routes

//INSERT
//@Routes POST api/account/add
//@decs use to add data privately
//@access PRIVATE

router.post('/add', (req, res) => {
    const jwToken = req.cookies.jwToken;

    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }

    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY);

        const decodedCustomer_ID = decodedToken.data.CustomerID;

        // Perform MySQL insert
        const sqlQuery = `INSERT INTO specialo_records (Customer_ID, Payment_ID, S_product_name, S_date, Product_decs) VALUES (${req.body.Customer_ID}, ${req.body.Payment_ID},'${req.body.S_product_name}',
        '${req.body.S_date}', '${req.body.Product_decs}')`;

        databaseConn.query(sqlQuery, function (error, results, fields) {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Error inserting data into the table." });
            }
            res.status(200).json(results);
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
   sqlQuery = `SELECT * FROM specialo_records`;
   databaseConn.query (sqlQuery, function(error,results,fields){
      if(error) throw error;
      res.status(200).json(results)
   })
})


router.get('/view_SpecialOrders',(req,res) => {
 
   const jwToken = req.cookies.jwToken;
  
   if (!jwToken) {
       console.log('JWT token not found in the cookie'); // Log the error
       return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
   }
  
   try {
       console.log('Verifying JWT token'); // Log the start of the token verification
       const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY);
  
       const decodedCustomer_ID = decodedToken.data.CustomerID;
       const sqlQuery = `SELECT * FROM specialo_records WHERE Customer_id = ?`;
       databaseConn.query (sqlQuery, decodedCustomer_ID , function(error,results,fields){
           if(error) {
               console.log('Error executing SQL query', error); // Log the error
               throw error;
           }
           console.log('SQL query executed successfully'); // Log the success
           res.status(200).json(results)
       });
   } catch (error) {
       console.log('Error verifying JWT token', error); // Log the error
       return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
   }
});

module.exports = router;