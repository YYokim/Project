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
   sqlQuery = `INSERT INTO payment_records (Customer_ID,Mode_of_payment, Ref_no, Date_of_payment, Payment_status) VALUES (${req.body.Customer_ID},'${req.body.Mode_of_payment}',
    '${req.body.Ref_no}', '${req.body.Date_of_payment}', '${req.body.Payment_status}')`;

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
    const jwToken = req.cookies.jwToken;
 
    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }
   
    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
   
        const decodedClient_ID = decodedToken.data.ClientID;
   sqlQuery = `SELECT * FROM payment_records`;
   databaseConn.query (sqlQuery, function(error,results,fields){
      if(error) throw error;
      res.status(200).json(results)
   })} catch (error) {
    console.log('Error verifying JWT token', error); // Log the error
    return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
}
});


//UPDATE
//routes PUT api/account/update/:id
//@desc Update temperature data by ID
//@access PRIVATE
router.put('/update/:id', (req, res) => {
    const jwToken = req.cookies.jwToken;
 
    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }
   
    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
   
        const decodedClient_ID = decodedToken.data.ClientID;

  const { Payment_status } = req.body;
  const Payment_ID = req.params.id;

  if (!Payment_status) {
      return res.status(400).json({ msg: 'Please provide Payment_status' });
  }

  const sqlQuery = 'UPDATE payment_records SET Payment_status = ? WHERE Payment_ID = ?';
  const values = [Payment_status, Payment_ID];

  databaseConn.query(sqlQuery, values, function (error, results, fields) {
      if (error) {
          console.error('Error updating payment record:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(results);
      }
    });
} catch (error) {
    console.log('Error verifying JWT token', error); // Log the error
    return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
}
});

//DELETE
// route: DELETE api/account/delete/:id
// @desc: Delete data by ID
// @access: PRIVATE
router.delete('/delete/:id', (req, res) => {
    const jwToken = req.cookies.jwToken;
 
    if (!jwToken) {
        console.log('JWT token not found in the cookie'); // Log the error
        return res.status(401).json({ success: false, message: "Error, JWT token not found in the cookie" });
    }
   
    try {
        console.log('Verifying JWT token'); // Log the start of the token verification
        const decodedToken = jwt.verify(jwToken, process.env.APP_JSONWEBTOKEN_KEY1);
   
        const decodedClient_ID = decodedToken.data.ClientID;
    const paymentId = req.params.id;
  
    // perform MySQL delete
    const sqlQuery = `DELETE FROM payment_records WHERE Payment_id = ${paymentId}`;
  
    databaseConn.query(sqlQuery, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    });} catch (error) {
        console.log('Error verifying JWT token', error); // Log the error
      return res.status(401).json({ success: false, message: "Error, invalid JWT token" });
      }
});
module.exports = router; 