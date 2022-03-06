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
    throw `Unsupported base: ${input}`;
  return true;
}

function platform(input) {
  const invalid = input?.filter(i => !config.platforms.find(e => e.value === i));
  if (invalid.length > 0)
    throw `Unsupported platforms: ${invalid.join(', ')}`;
  return true;
}

module.exports = {name, base, platform};
