const config = require('../config');

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
  if (!config.bases.find(e => e.value === input))
    return 'Base does not exist!';
  return true;
}

function platform(input) {
  if (input?.filter(i => !config.platforms.find(e => e.value === i)).length > 0)
    return 'Platform does not exist!';
  return true;
}

module.exports = {name, base, platform};
