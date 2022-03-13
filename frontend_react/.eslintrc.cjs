module.exports = {
    "env": {
        "node": true,
        es6: true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    settings:{
        react: {
            "version": "detect"
        }
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
          "modules": true
        }
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "sort-imports-es6-autofix"
    ],
    "rules": {
        "sort-imports-es6-autofix/sort-imports-es6": [2, {
            "ignoreCase": false,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
          }],
          "no-undef": "warn",
          "no-case-declarations": "off",
          "@typescript-eslint/no-use-before-define": "off",
          "@typescript-eslint/explicit-function-return-type": "off",
    }
}
