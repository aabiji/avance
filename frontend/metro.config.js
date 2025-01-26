const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const projectRoot = __dirname;
  const monorepoRoot = path.resolve(projectRoot, '../..');
  const config = getDefaultConfig(projectRoot);

  config.watchFolders = [monorepoRoot];

  config.resolver = {
    ...config.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ]
  };

  return config;
})();
