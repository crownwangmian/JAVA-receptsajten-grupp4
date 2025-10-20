const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.post('/recipes/:recipeId/comments', async (req, res) => {
  const { recipeId } = req.params;
  const { name, comment } = req.body;
  if (!name?.trim() || !comment?.trim()) return res.status(400).json({ error: 'Missing name or comment' });

  try {
    await Recipe.updateOne(
      { _id: recipeId },
      { $push: { comments: { name: name.trim(), comment: comment.trim(), createdAt: new Date() } } }
    );
    return res.status(201).json({ message: 'Kommentar tillagd' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;