const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  const [gameCount, categoryCount] = await Promise.all([
    Game.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Game Inventory Home",
    game_count: gameCount,
    category_count: categoryCount,
  });
});

// Display list of all Games
exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find({}, "title")
    .sort({ title: 1 })
    .exec();

  res.render("game_list", {
    title: "Game List",
    game_list: allGames,
  });
});

// Display detail page for a specific Game
exports.game_detail = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate("category").exec();

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: game.title,
    game: game,
  });
});

// Display Game create form on GET
exports.game_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();

  res.render("game_form", {
    title: "Add Game",
    categories: allCategories,
  });
});

// Handle Game create on POST
exports.game_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  body("title", "Game title required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*")
    .escape(),
  body("category", "Must choose at least one category")
    .isArray({ min: 1 }),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price required")
    .isCurrency({ allow_negatives: false })
    .withMessage("Price must be a positive number")
    .isCurrency({ require_decimal: true, digits_after_decimal: [2] })
    .withMessage("Price must be formatted with 2 digits following a decimal; eg: 17.99, 16.00, 0.95, etc."),
  body("quantity")
    .trim()
    .isInt({ min: 0 })
    .escape()
    .withMessage("Minimum quantity of 0")
    .isInt({ max: 100 })
    .withMessage("Maximum quantity of 100"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: (req.file ? req.file.filename : ''),
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name").exec();

      for (const category of allCategories) {
        if (game.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      let formattedPrice = '';
      if (game.price) formattedPrice = game.price.toString();

      if (req.file) {
        game.image = '';
        fs.unlink(req.file.path, (err) => {
          if (err) console.log(err);
        });
      }

      res.render("game_form", {
        title: "Add Game",
        categories: allCategories,
        formatted_price: formattedPrice,
        game: game,
        errors: errors.array(),
        update_txt: "*If photo was previously selected, please select again",
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Display Game delete form on GET
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate("category").exec();

  if (game === null) {
    res.redirect("/catalog/games");
  }

  res.render("game_delete", {
    title: "Delete Game",
    game: game,
  });
});

// Handle Game delete on POST
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  await Game.findByIdAndRemove(req.body.gameid);
  res.redirect("/catalog/games");
});

// Display Game update form on GET
exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allCategories] = await Promise.all([
    Game.findById(req.params.id).populate("category").exec(),
    Category.find({}, "name").exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  for (const category of allCategories) {
    for (const game_c of game.category) {
      if (category._id.toString() === game_c._id.toString()) {
        category.checked = "true";
      }
    }
  }

  let formattedPrice = '';
  if (game.price) formattedPrice = game.price.toString();

  res.render("game_form", {
    title: "Update Game",
    formatted_price: formattedPrice,
    game: game,
    categories: allCategories,
    update_txt: "*If no file is chosen, the previous photo will remain",
  });
});

// Handle Game update on POST
exports.game_update_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  body("title", "Game title required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*")
    .escape(),
  body("category", "Must choose at least one category")
    .isArray({ min: 1 }),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price required")
    .isCurrency({ allow_negatives: false })
    .withMessage("Price must be a positive number")
    .isCurrency({ require_decimal: true, digits_after_decimal: [2] })
    .withMessage("Price must be formatted with 2 digits following a decimal; eg: 17.99, 16.00, 0.95, etc."),
  body("quantity")
    .trim()
    .isInt({ min: 0 })
    .escape()
    .withMessage("Minimum quantity of 0")
    .isInt({ max: 100 })
    .withMessage("Maximum quantity of 100"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const lastGame = await Game.findById(req.params.id).exec();

    const game = new Game({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: (req.file ? req.file.filename : lastGame.image),
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name").exec();

      for (const category of allCategories) {
        if (game.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      let formattedPrice = '';
      if (game.price) formattedPrice = game.price.toString();

      res.render("game_form", {
        title: "Update Game",
        categories: allCategories,
        formatted_price: formattedPrice,
        game: game,
        errors: errors.array(),
        update_txt: "*If no file is chosen, the previous photo will remain",
      });
      return;
    } else {
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(updatedGame.url);
    }
  }),
];