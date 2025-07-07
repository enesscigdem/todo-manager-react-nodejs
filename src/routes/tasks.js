const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/', auth, taskController.list);
router.post('/', auth, taskController.create);
router.put('/:id', auth, taskController.update);
router.patch('/:id/toggle', auth, taskController.toggle);
router.delete('/:id', auth, taskController.remove);

module.exports = router;
