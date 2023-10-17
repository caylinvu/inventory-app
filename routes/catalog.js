const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Require controller modules
const game_controller = require("../controllers/gameController");
const category_controller = require("../controllers/categoryController");

/// GAME ROUTES ///

// GET catalog home page
router.get("/", game_controller.index);

// GET request for creating a Game (This must come before routes that display Game - uses id)
router.get("/game/create", game_controller.game_create_get);

// POST request for creating Game
router.post("/game/create", upload.single('image'), game_controller.game_create_post);

// GET request to delete Game
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete Game
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update Game
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update Game
router.post("/game/:id/update", upload.single('image'), game_controller.game_update_post);

// GET request for one Game
router.get("/game/:id", game_controller.game_detail);

// GET request for list of all Game items
router.get("/games", game_controller.game_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category (This must come before route that displays Category - uses id)
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories
router.get("/categories", category_controller.category_list);

module.exports = router;