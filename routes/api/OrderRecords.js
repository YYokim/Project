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
       sqlQuery = `INSERT INTO order_records (Customer_ID, Payment_ID, O_product_name, O_date, Product_price) VALUES (${req.body.Customer_ID}, ${req.body.Payment_ID},'${req.body.O_product_name}',
        '${req.body.O_date}', '${req.body.Product_price}')`; 

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

module.exports = router;