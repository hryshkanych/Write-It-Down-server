const express = require('express');

const memoryController = require('../controllers/memoryController');

const router = express.Router();

router.route('/addMemory').post(memoryController.addMemory);
router.route('/getAllMemories').post(memoryController.getAllMemories);
router.route('/deleteMemory/:id').delete(memoryController.deleteMemory);
router.route('/updateMemory/:id').put(memoryController.updateMemory);


module.exports = router;