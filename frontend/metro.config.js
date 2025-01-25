const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Configure react-native-svg-transformer to import svg files as source files
const sourceExts = config.resolver.sourceExts;
const assetExts = config.resolver.assetExts;

config.resolver.assetExts = assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

module.exports = config;
