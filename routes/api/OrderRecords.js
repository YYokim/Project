var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var databaseConn = require ('../../config/database.js');
//Routes

//INSERT
//@Routes POST api/account/add
//@decs use to add data privately
//@access PRIVATE
router.post('/add', (req, res) => {
    // perform MySQL insert
    const jwToken = req.cookies.jwToken;
 
  if (!jwToken) {
      console.log('JWT token not found in the cookie'); // Log the error
      return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
  }
 
  try {
      console.log('Verifying JWT token'); // Log the start of the token verification
      const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY);
 
      const decodedCustomer_ID = decodedToken.data.CustomerID;
       const sqlQuery = `INSERT INTO order_records (Customer_ID, Payment_ID, O_product_name, O_date, Product_price) VALUES (${req.body.Customer_ID}, ${req.body.Payment_ID},'${req.body.O_product_name}',
        '${req.body.O_date}', '${req.body.Product_price}')`; 

       databaseConn.query(sqlQuery, function (error, results, fields) {
           if (error) throw error;
           res.status(200).json(results);
       })
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
   sqlQuery = `SELECT * FROM order_records`;
   databaseConn.query (sqlQuery, function(error,results,fields){
      if(error) throw error;
      res.status(200).json(results)
   })
})


//UPDATE
//routes PUT api/account/update/:id
//@desc Update temperature data by ID
//@access PRIVATE

router.put('/update/:id', (req, res) => {
    const orderId = req.params.id;
  
    // perform MySQL update
    const sqlQuery = `UPDATE order_records SET
        O_product_name = '${req.body.O_product_name}',
        O_date = '${req.body.O_date}',
        Product_price = '${req.body.Product_price}'
      WHERE
        Order_id = ${orderId}`;
  
    databaseConn.query(sqlQuery, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    });
});


//DELETE
// route: DELETE api/account/delete/:id
// @desc: Delete data by ID
// @access: PRIVATE
router.delete('/delete/:id', (req, res) => {
    const orderId = req.params.id;
  
    // perform MySQL delete
    const sqlQuery = ` DELETE FROM order_records
      WHERE Order_id = ${orderId}`;
  
    databaseConn.query(sqlQuery, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    });
});


router.get('/view_Orders',(req,res) => {
 
  const jwToken = req.cookies.jwToken;
 
  if (!jwToken) {
      console.log('JWT token not found in the cookie'); // Log the error
      return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
  }
 
  try {
      console.log('Verifying JWT token'); // Log the start of the token verification
      const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY);
 
      const decodedCustomer_ID = decodedToken.data.CustomerID;
      const sqlQuery = `SELECT * FROM order_records WHERE Customer_id = ?`;
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