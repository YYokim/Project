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
   sqlQuery = `INSERT INTO acc_records (Customer_name, Customer_address, Customer_email, Customer_password, Customer_contactnum) VALUES ('${req.body.Customer_name}',
    '${req.body.Customer_address}', '${req.body.Customer_email}', '${req.body.Customer_password}', '${req.body.Customer_contactnum}')`;

   databaseConn.query(sqlQuery, function (error, results, fields) {
       if (error) throw error;
       res.status(200).json(results);
   });
});




router.get('/my_account',(req,res) => {
 
   const jwToken = req.cookies.jwToken;
  
   if (!jwToken) {
       console.log('JWT token not found in the cookie'); // Log the error
       return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
   }
  
   try {
       console.log('Verifying JWT token'); // Log the start of the token verification
       const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY);
  
       const decodedCustomer_ID = decodedToken.data.CustomerID;
       const sqlQuery = `SELECT * FROM acc_records WHERE Customer_id = ?`;
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


//SELECT
//routes get api/account/view
//@desc can view data
//@access PUBLIC
router.get('/view',(req,res) => {
   sqlQuery = `SELECT * FROM acc_records`;
   databaseConn.query (sqlQuery, function(error,results,fields){
      if(error) throw error;
      res.status(200).json(results)
   })
});

//UPDATE
//routes PUT api/account/update/:id
//@desc Update temperature data by ID
//@access PRIVATE
router.put('/update/:id', (req, res) => {
   const customerId = req.params.id;
 
   // perform MySQL update
   const sqlQuery = `
     UPDATE acc_records
     SET
       Customer_name = '${req.body.Customer_name}',
       Customer_address = '${req.body.Customer_address}',
       Customer_email = '${req.body.Customer_email}',
       Customer_password = '${req.body.Customer_password}',
       Customer_contactnum = '${req.body.Customer_contactnum}'
     WHERE
       Customer_id = ${customerId}`;
 
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
   const customerId = req.params.id;
 
   // perform MySQL delete
   const sqlQuery = `DELETE FROM acc_records WHERE Customer_id = ${customerId}`;
 
   databaseConn.query(sqlQuery, function (error, results, fields) {
     if (error) throw error;
     res.status(200).json(results);
   });
});

module.exports = router;