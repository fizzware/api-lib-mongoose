const express = require('express');
const generate = require('./generate');

function CRUD(schema, options, preMiddlewares) {
  const router = express.Router();

  if (preMiddlewares && Array.isArray(preMiddlewares) && preMiddlewares.length) {
    preMiddlewares.forEach((middleware) => { router.use(middleware); });
  }

  const getAll = {
    type: 'get-many',
    schema
  };

  if (options.sort) {
    getAll.sort = options.sort;
  }

  const get = {
    type: 'get-one',
    restrict: params => ({ _id: params.id }),
    schema
  };

  if (options.populate) {
    get.populate = options.populate;
  }

  const insert = {
    type: 'insert',
    schema
  };

  const update = {
    type: 'update',
    schema
  };

  const del = {
    type: 'delete',
    schema,
    restrict: params => ({ _id: params.id })
  };

  router.get('/', generate(getAll));
  router.get('/:id', generate(get));
  router.post('/', generate(insert));
  router.put('/', generate(update));
  router.delete('/:id', generate(del));

  return router;
}

module.exports = CRUD;
