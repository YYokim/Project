var express = require('express');
var router = express.Router();
var databaseConn = require ('../../config/database.js');

//Routes

//INSERT
//@Routes POST api/account/add
//@decs use to add data privately
//@access PRIVATE

router.post('/add', (req, res) => {
// perform MySQL insert
   sqlQuery = `INSERT INTO payment_records (Customer_ID,Mode_of_payment, Ref_no, Date_of_payment, Payment_status) VALUES (${req.body.Customer_ID},'${req.body.Mode_of_payment}',
    '${req.body.Ref_no}', '${req.body.Date_of_payment}', '${req.body.Payment_status}')`;

   databaseConn.query(sqlQuery, function (error, results, fields) {
       if (error) throw error;
       res.status(200).json(results);
   })
});

//SELECT
//routes get api/account/view
//@desc can view data
//@access PUBLIC
router.get('/view',(req,res) => {
   sqlQuery = `SELECT * FROM payment_records`;
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
    const paymentId = req.params.id;
  
    // perform MySQL update
    const sqlQuery = `
      UPDATE payment_records
      SET
        Mode_of_payment = '${req.body.Mode_of_payment}',
        Ref_no = '${req.body.Ref_no}',
        Date_of_payment = '${req.body.Date_of_payment}',
        Payment_status = '${req.body.Payment_status}'
      WHERE
        Payment_id = ${paymentId}`;
  
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
    const paymentId = req.params.id;
  
    // perform MySQL delete
    const sqlQuery = `DELETE FROM payment_records WHERE Payment_id = ${paymentId}`;
  
    databaseConn.query(sqlQuery, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    });
});



module.exports = router;