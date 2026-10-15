module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // NOTE: react-native-reanimated/plugin is already automatically included
      // by nativewind/babel. Adding it again causes double-transformation of worklets!
    ],
  };
};
