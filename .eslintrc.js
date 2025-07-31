module.exports = {
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    // Disable warnings during active development
    "no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
    "import/no-anonymous-default-export": "off",
    "no-useless-escape": "off",
    "default-case": "off",
    "no-lone-blocks": "off",
    "no-loop-func": "off"
  }
};