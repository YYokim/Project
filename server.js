const express = require('express');
const app = express();
const jwt= require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const dotenv = require ('dotenv');
const bcrypt = require('bcrypt');

app.use(cookieParser());

const Accroutes = require('./routes/api/AccountRecords.js');
const Payroutes = require('./routes/api/PaymentRecords.js');
const Orderroutes = require('./routes/api/OrderRecords.js');
const Specialroutes = require('./routes/api/SpecialRecords.js');
const Comproutes = require('./routes/api/CompiledRecords.js');
const Invroutes = require('./routes/api/InventoryRecords.js');
const auth= require('./routes/api/auth.js');

dotenv.config({path:'./.env'});

app.use(express.json({ extended: false}));


app.use('/AccountRecords', Accroutes);
app.use('/PaymentRecords', Payroutes);
app.use('/OrderRecords', Orderroutes);
app.use('/SpecialRecords', Specialroutes);
app.use('/CompiledRecords', Comproutes);
app.use('/InventoryRecords', Invroutes);
app.use('/auth', auth);


 
app.get('/',(req,res)=>{
res.send('run api run');})

const PORT = 5000;

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));