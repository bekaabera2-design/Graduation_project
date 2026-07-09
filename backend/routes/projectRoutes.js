const router = require("express").Router();
const projectController = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// Protect all project routes
router.use(protect);

// Project routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/user/:userId', projectController.getProjectsByUser);

module.exports = router;