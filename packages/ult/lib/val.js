function project(name) {
  if (!name)
    return 'Project name is missing (e.g. npx ult Demo)';
  if (name.length > 100) 
    return 'Project name cannot exceed 100 characters';
  if (!name.match(/^[a-zA-Z0-9]+$/))
    return 'Project name should be alphanumeric';
  return true;
}

module.exports = {project};
