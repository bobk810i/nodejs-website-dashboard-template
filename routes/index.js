const express = require('express');
const router = express.Router();
router.use(express.static('public'));

// Routes to pages
router.get('/', async (req, res)=>{
    res.status(200).render('index');
})

module.exports = router;