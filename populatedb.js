#! /usr/bin/env node

console.log(
  'This script populates some test games and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Game = require("./models/game");

const categories = [];
const games = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the RPG genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function gameCreate(index, title, description, category, price, quantity) {
  const gamedetail = {
    title: title,
    description: description,
    price: price,
    quantity: quantity,
  };
  if (category != false) gamedetail.category = category;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Action", "Fast paced, fighting, boom boom, smack smack"),
    categoryCreate(1, "RPG", "Insert yourself into a cool story and role play away"),
    categoryCreate(2, "Multiplayer", "Play with your friends"),
    categoryCreate(3, "Shooter", "Guns, shooting, shooting guns"),
    categoryCreate(4, "Indie", "From smaller dev teams but still fantastic"),
    categoryCreate(5, "Roguelite", "Fight, die, come back stronger"),
    categoryCreate(6, "Adventure", "Go on an adventurous journey"),
    categoryCreate(7, "Strategy", "Have to use your brain a little"),
    categoryCreate(8, "Casual", "Sit back and relax"),
    categoryCreate(9, "Open world", "Big map with lots to see and explore"),
    categoryCreate(10, "Survival", "Use resources around you to try to survive"),
  ]);
}

async function createGames() {
  console.log("Adding games");
  await Promise.all([
    gameCreate(0,
      "Borderlands GOTY Enhanced",
      "Discover the original co-op shooter-looter, crammed with new enhancements! As one of 4 trigger-happy mercenaries with RPG progression, equip bazillions of guns to take on the desert planet Pandora.",
      [categories[1], categories[2], categories[3]],
      29.99,
      4
    ),
    gameCreate(1,
      "Hades",
      "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.",
      [categories[0], categories[4], categories[5]],
      24.99,
      9
    ),
    gameCreate(2,
      "Mass Effect Legendary Edition",
      "The Mass Effect™ Legendary Edition includes single-player base content and over 40 DLC from the highly acclaimed Mass Effect, Mass Effect 2, and Mass Effect 3 games, including promo weapons, armors, and packs — remastered and optimized for 4K Ultra HD.",
      [categories[0], categories[1], categories[3]],
      59.99,
      2
    ),
    gameCreate(3,
      "Baldur's Gate 3",
      "Baldur’s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.",
      [categories[1], categories[6], categories[7]],
      59.99,
      3
    ),
    gameCreate(4,
      "DAVE THE DIVER",
      "DAVE THE DIVER is a casual, singleplayer adventure RPG featuring deep-sea exploration and fishing during the day and sushi restaurant management at night. Join Dave and his quirky friends as they seek to uncover the secrets of the mysterious Blue Hole.",
      [categories[8], categories[4], categories[1]],
      19.99,
      4
    ),
    gameCreate(5,
      "Moonlighter",
      "Moonlighter is an Action RPG with rogue-lite elements that demonstrates two sides of the coin – revealing everyday routines of Will, an adventurous shopkeeper that secretly dreams of becoming a hero.",
      [categories[0], categories[4], categories[5]],
      19.99,
      8  
    ),
    gameCreate(6,
      "ARK: Survival Evolved",
      "Stranded on the shores of a mysterious island, you must learn to survive. Use your cunning to kill or tame the primeval creatures roaming the land, and encounter other players to survive, dominate... and escape!",
      [categories[1], categories[10], categories[2]],
      14.99,
      12
    ),
    gameCreate(7,
      "The Elder Scrolls V: Skyrim Special Edition",
      "Winner of more than 200 Game of the Year Awards, Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features like remastered art and effects, volumetric god rays, dynamic depth of field, screen-space reflections, and more.",
      [categories[1], categories[9], categories[6]],
      39.99,
      5
    ),
  ]);
}