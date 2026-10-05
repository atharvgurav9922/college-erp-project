const express = require('express');
const router = express.Router();
const models = require('../models');

// Generic CRUD generator for any model
const createCrudRoutes = (Model) => {
  const modelRouter = express.Router();

  // Get all
  modelRouter.get('/', async (req, res) => {
    try {
      const docs = await Model.find();
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get by ID (using the string 'id' field if available, fallback to _id)
  modelRouter.get('/:id', async (req, res) => {
    try {
      const doc = await Model.findOne({ id: req.params.id }) || await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create
  modelRouter.post('/', async (req, res) => {
    try {
      const newDoc = new Model(req.body);
      const savedDoc = await newDoc.save();
      res.status(201).json(savedDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update
  modelRouter.put('/:id', async (req, res) => {
    try {
      const updatedDoc = await Model.findOneAndUpdate(
        { $or: [{ id: req.params.id }, { _id: req.params.id }] },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updatedDoc) return res.status(404).json({ message: 'Not found' });
      res.json(updatedDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete
  modelRouter.delete('/:id', async (req, res) => {
    try {
      const deletedDoc = await Model.findOneAndDelete({ $or: [{ id: req.params.id }, { _id: req.params.id }] });
      if (!deletedDoc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return modelRouter;
};

// Register routes for all models
Object.keys(models).forEach(modelName => {
  const routePath = `/${modelName.toLowerCase()}s`; // e.g., /users, /students
  router.use(routePath, createCrudRoutes(models[modelName]));
});

// Custom Login Route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await models.User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
