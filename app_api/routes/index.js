const express = require('express');
const router = express.Router();

console.log('app_api routes/index.js loaded');

const tripsController = require('../controllers/trips');

// GET: /api/trips
// POST: /api/trips
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(tripsController.tripsAddTrip);

// GET: /api/trips/:tripCode
// PUT: /api/trips/:tripCode
// DELETE: /api/trips/:tripCode
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(tripsController.tripsUpdateTrip)
  .delete(tripsController.tripsDeleteTrip);

module.exports = router;