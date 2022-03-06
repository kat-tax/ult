const cfg = require('../config');

function name(input) {
  if (!input)
    return 'Project name is required!';
  if (input.length > 100) 
    return 'Project name cannot exceed 100 characters!';
  if (!input.match(/^[a-zA-Z0-9]+$/))
    return 'Project name should be alphanumeric and contain no spaces!';
  return true;
}

function base(input) {
  if (!input)
    return 'Project base is required!';
  if (!cfg.bases.find(e => e.value === input)) 
    return 'Project base does not exist!';
  if (!input.match(/^[a-z0-9]+$/))
    return 'Project base is invalid!';
  return true;
}

module.exports = {name, base};
