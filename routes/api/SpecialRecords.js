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
   sqlQuery = `INSERT INTO specialo_records (Customer_ID, Payment_ID, S_product_name, S_date, Product_decs) VALUES (${req.body.Customer_ID}, ${req.body.Payment_ID},'${req.body.S_product_name}',
    '${req.body.S_date}', '${req.body.Product_decs}')`;

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
   sqlQuery = `SELECT * FROM specialo_records`;
   databaseConn.query (sqlQuery, function(error,results,fields){
      if(error) throw error;
      res.status(200).json(results)
   })
})


module.exports = router;