const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.list);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.patch('/:id/toggle', taskController.toggle);
router.delete('/:id', taskController.remove);

module.exports = router;
