const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/projects/:id/approve', adminController.approveProject);
router.put('/projects/:id/reject', adminController.rejectProject);
router.get('/stats', adminController.getStats);

module.exports = router;