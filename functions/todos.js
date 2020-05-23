const crud = require('./common/crud');

exports.handler = crud(
  'todos',
  {
    title: { type: 'string' },
    completed: { type: 'boolean', default: 'false' },
  }
);
