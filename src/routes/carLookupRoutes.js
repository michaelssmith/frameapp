const express = require('express');
const weatherService = require('../services/weatherLookup.js');
const debug = require('debug')('app:carLookupRoutes');

const router = express.Router();

function carRouter() {
  router.route('/')
    .get((req, res) => {
      res.render('index', { title: 'Car lookup' });
    });

  router.route('/weather')
    .get((req, res) => {
      (async function GetWeather() {
        const weather = await weatherService.getWeather();
        debug(weather);
        res.json(weather);
      }());
    });
/*
  router.route('/models/:manufacturer')
    .get((req, res) => {
      const { manufacturer } = req.params;

      (async function GetManufacturers() {
        const models = await weatherService.getModels(manufacturer);
        res.json(models);
      }());
    });

  router.route('/trims/:manufacturer/:model')
    .get((req, res) => {
      const { manufacturer } = req.params;
      const { model } = req.params;

      (async function GetTrims() {
        const trims = await v.getTrims(manufacturer, model);
        res.json(trims);
      }());
    });

  router.route('/vehicle/:reg')
    .get((req, res) => {
      const { reg } = req.params;

      (async function GetVehicle() {
        const vehicle = await weatherService.getVehicleByRegistration(reg);
        res.json(vehicle);
      }());
    });
*/
  return router;
}

module.exports = carRouter;
