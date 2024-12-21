// For Rendering home page and File upload etc.
const express = require('express')
const router = express.Router();


router.get('/home',(req,res)=>{
    res.render('home')
})






module.exports = router; 
