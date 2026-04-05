import State from "../models/State.js";
import Destination from "../models/Destination.js";


// GET ALL STATES

export const getStates = async (req, res) => {

  const states = await State.find();

  res.json(states);

};


// GET DESTINATIONS BY STATE

export const getDestinationsByState = async (req, res) => {

  const destinations = await Destination
    .find({ stateId: req.params.stateId })
    .populate("stateId");

  res.json(destinations);

};


// SEARCH STATES OR DESTINATIONS

export const searchPlaces = async (req, res) => {

  const query = req.query.q;

  const states = await State.find({
    name: { $regex: query, $options: "i" }
  });

  const destinations = await Destination.find({
    name: { $regex: query, $options: "i" }
  });

  res.json({
    states,
    destinations
  });

};


// GET SINGLE DESTINATION

export const getDestination = async (req, res) => {

  const destination = await Destination
    .findById(req.params.id)
    .populate("stateId");

  res.json(destination);

};