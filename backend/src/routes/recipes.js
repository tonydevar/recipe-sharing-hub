const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/recipes.json');

const SEED_RECIPES = [
  {
    id: uuidv4(),
    title: 'Scrambled Eggs',
    description: 'Classic fluffy scrambled eggs, perfect for a quick and easy breakfast.',
    ingredients: ['4 large eggs', '2 tablespoons butter', '2 tablespoons milk', 'Salt to taste', 'Black pepper to taste'],
    steps: [
      'Crack the eggs into a bowl and add milk, salt, and pepper.',
      'Whisk until well combined.',
      'Melt butter in a non-stick skillet over medium-low heat.',
      'Pour in the egg mixture and cook, stirring gently, until eggs are just set.',
      'Remove from heat while still slightly glossy and serve immediately.'
    ],
    cookTime: 10,
    difficulty: 'easy',
    category: 'Breakfast',
    servings: 2,
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Caesar Salad',
    description: 'A classic Caesar salad with crispy romaine lettuce, crunchy croutons, and rich Caesar dressing.',
    ingredients: [
      '1 large head romaine lettuce, chopped',
      '1 cup croutons',
      '1/2 cup Parmesan cheese, shaved',
      '3 tablespoons Caesar dressing',
      '1 clove garlic',
      '1 lemon, juiced',
      'Black pepper to taste'
    ],
    steps: [
      'Wash and chop the romaine lettuce into bite-sized pieces.',
      'Rub the salad bowl with the cut garlic clove.',
      'Add the lettuce to the bowl.',
      'Drizzle with Caesar dressing and lemon juice.',
      'Toss well to coat.',
      'Top with croutons and shaved Parmesan.',
      'Season with black pepper and serve immediately.'
    ],
    cookTime: 15,
    difficulty: 'easy',
    category: 'Lunch',
    servings: 4,
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Spaghetti Carbonara',
    description: 'Authentic Italian pasta dish with a creamy egg-based sauce, crispy pancetta, and Pecorino Romano cheese.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large eggs',
      '100g Pecorino Romano cheese, grated',
      '100g Parmesan cheese, grated',
      '2 cloves garlic',
      'Black pepper, freshly ground',
      'Salt for pasta water'
    ],
    steps: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
      'While pasta cooks, fry pancetta in a large skillet over medium heat until crispy.',
      'Add garlic to the pancetta and cook 1 minute, then remove garlic.',
      'In a bowl, whisk together eggs and both cheeses. Season generously with black pepper.',
      'Reserve 1 cup of pasta cooking water before draining.',
      'Add hot drained pasta to the pancetta skillet off the heat.',
      'Quickly pour egg mixture over pasta, tossing rapidly and adding pasta water as needed to create a creamy sauce.',
      'Serve immediately with extra cheese and pepper.'
    ],
    cookTime: 30,
    difficulty: 'medium',
    category: 'Dinner',
    servings: 4,
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies with crispy edges and gooey chocolate centers.',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 teaspoon baking soda',
      '1 teaspoon salt',
      '1 cup (2 sticks) butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup packed brown sugar',
      '2 large eggs',
      '2 teaspoons vanilla extract',
      '2 cups chocolate chips'
    ],
    steps: [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, combine flour, baking soda and salt; set aside.',
      'In a large bowl, beat butter and both sugars until creamy.',
      'Add eggs and vanilla to butter mixture and beat well.',
      'Gradually add flour mixture, mixing until just combined.',
      'Stir in chocolate chips.',
      'Drop rounded tablespoons of dough onto ungreased baking sheets.',
      'Bake for 9 to 11 minutes or until golden brown.',
      'Cool on baking sheets for 2 minutes before transferring to wire racks.'
    ],
    cookTime: 45,
    difficulty: 'medium',
    category: 'Dessert',
    servings: 48,
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Guacamole',
    description: 'Fresh and chunky guacamole made with ripe avocados, lime juice, cilantro, and a hint of jalapeño.',
    ingredients: [
      '3 ripe avocados',
      '1 lime, juiced',
      '1/2 teaspoon salt',
      '1/2 cup fresh cilantro, chopped',
      '1/2 red onion, finely diced',
      '1 jalapeño, seeded and minced',
      '2 plum tomatoes, seeded and diced',
      '1 clove garlic, minced'
    ],
    steps: [
      'Cut avocados in half, remove pits, and scoop flesh into a bowl.',
      'Mash avocados with a fork to desired consistency (chunky or smooth).',
      'Add lime juice and salt; mix well.',
      'Fold in cilantro, red onion, jalapeño, tomatoes, and garlic.',
      'Taste and adjust seasoning with more salt and lime juice.',
      'Serve immediately or press plastic wrap directly onto surface to prevent browning.'
    ],
    cookTime: 10,
    difficulty: 'easy',
    category: 'Snack',
    servings: 6,
    image: null,
    createdAt: new Date().toISOString()
  }
];

function readRecipes() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8').trim();
    if (!content) {
      return [];
    }
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

function writeRecipes(recipes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(recipes, null, 2), 'utf8');
}

// Seed on startup if needed
(function seedIfEmpty() {
  const existing = readRecipes();
  if (existing.length === 0) {
    writeRecipes(SEED_RECIPES);
  }
})();

// GET /api/recipes
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let recipes = readRecipes();

  if (category) {
    recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    recipes = recipes.filter(r => {
      const titleMatch = r.title.toLowerCase().includes(q);
      const ingredientMatch = r.ingredients.some(i => i.toLowerCase().includes(q));
      return titleMatch || ingredientMatch;
    });
  }

  res.json(recipes);
});

// GET /api/recipes/:id
router.get('/:id', (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

// POST /api/recipes
router.post('/', (req, res) => {
  const { title, description, ingredients, steps, cookTime, difficulty, category, servings, image } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'description is required' });
  }
  if (cookTime === undefined || cookTime === null || isNaN(Number(cookTime))) {
    return res.status(400).json({ error: 'cookTime is required and must be a number' });
  }
  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'difficulty is required and must be easy, medium, or hard' });
  }
  if (!category || !['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].includes(category)) {
    return res.status(400).json({ error: 'category is required and must be Breakfast, Lunch, Dinner, Dessert, or Snack' });
  }
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'ingredients is required and must be a non-empty array' });
  }
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: 'steps is required and must be a non-empty array' });
  }

  const newRecipe = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    ingredients,
    steps,
    cookTime: Number(cookTime),
    difficulty,
    category,
    servings: servings !== undefined ? Number(servings) : 4,
    image: image || null,
    createdAt: new Date().toISOString()
  };

  const recipes = readRecipes();
  recipes.push(newRecipe);
  writeRecipes(recipes);

  res.status(201).json(newRecipe);
});

// PUT /api/recipes/:id
router.put('/:id', (req, res) => {
  const recipes = readRecipes();
  const index = recipes.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const { title, description, ingredients, steps, cookTime, difficulty, category, servings, image } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'description is required' });
  }
  if (cookTime === undefined || cookTime === null || isNaN(Number(cookTime))) {
    return res.status(400).json({ error: 'cookTime is required and must be a number' });
  }
  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'difficulty is required and must be easy, medium, or hard' });
  }
  if (!category || !['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].includes(category)) {
    return res.status(400).json({ error: 'category is required and must be Breakfast, Lunch, Dinner, Dessert, or Snack' });
  }
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'ingredients is required and must be a non-empty array' });
  }
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ error: 'steps is required and must be a non-empty array' });
  }

  const updatedRecipe = {
    ...recipes[index],
    title: title.trim(),
    description: description.trim(),
    ingredients,
    steps,
    cookTime: Number(cookTime),
    difficulty,
    category,
    servings: servings !== undefined ? Number(servings) : recipes[index].servings,
    image: image !== undefined ? image : recipes[index].image
  };

  recipes[index] = updatedRecipe;
  writeRecipes(recipes);

  res.json(updatedRecipe);
});

// DELETE /api/recipes/:id
router.delete('/:id', (req, res) => {
  const recipes = readRecipes();
  const index = recipes.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  recipes.splice(index, 1);
  writeRecipes(recipes);

  res.status(204).send();
});

module.exports = router;
