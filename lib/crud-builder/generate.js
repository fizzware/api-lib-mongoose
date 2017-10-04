/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */

const debug = require('debug')('api-lib:crud-builder:generate');

module.exports = (options) => {
  switch (options.type) {
    case 'get-many':
    case 'get-one':
      return (req, res) => {
        const schema = options.schema;
        let restrict;

        if (options.restrict) {
          restrict = options.restrict(req.params);
        } else {
          restrict = {};
        }

        const method = options.type === 'get-one' ? 'findOne' : 'find';

        let query = schema[method](restrict);

        if (options.populate) {
          query = query.populate(options.populate);
        }

        if (options.sort) {
          query = query.sort(options.sort);
        }

        query.exec((err, results) => {
          res.send(results).end();
        });
      };

    case 'insert':
      return (req, res) => {
        const schema = options.schema;
        const item = new schema(req.body);

        item.save((err, results) => {
          if (err) {
            res.status(400).send(err.errors).end();
          }

          res.send(results).end();
        });
      };

    case 'update':
      return (req, res) => {
        debug(req.body);

        const schema = options.schema;

        debug('about to save...', req.body);

        schema.update({ _id: req.body._id }, req.body, (err, results) => {
          if (err) {
            debug('validation errors: ', err);
            res.status(400).send(err.errors).end();
          }

          debug('saved.');
          res.send(results).end();

          debug('disconnecting');
        });
      };

    case 'delete':
      return (req, res) => {
        const schema = options.schema;

        let restrict;
        if (options.restrict) {
          restrict = options.restrict(req.params);
        } else {
          restrict = {};
        }

        schema.remove(restrict, () => {
          res.status(200).end();
        });
      };
    default:
      throw new Error('unrecognised type ', options.type);
  }
};
