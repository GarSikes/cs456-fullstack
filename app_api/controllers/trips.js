const Trip = require('../models/travlr');

// GET: /trips - Retrieve list of all active trips
const tripsList = async (req, res) => {
  const q = await Trip.find({}).exec();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - Retrieve a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Trip.find({ code: req.params.tripCode }).exec();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode
};