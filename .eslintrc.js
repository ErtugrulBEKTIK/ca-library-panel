module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "max-len": ["error", { "code": 360 }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
