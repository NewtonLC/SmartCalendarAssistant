module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy"
  }
};