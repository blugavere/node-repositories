
module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "rules": {
        "curly": 2,
        "eol-last": [1],
        "quotes": [2, "single"],
        "new-cap": [0],
        "no-path-concat": [0],
        "no-mixed-requires": [0],
        "no-underscore-dangle": [0],
        "no-trailing-spaces": [1],
        "no-unused-vars": [1],
        "semi": [2, "always"],
        "no-console": [0],
        "no-dupe-keys": [1],
        'handle-callback-err': 2,
        'valid-typeof': 2,
        'no-new-require': 1,
        'no-lonely-if': 1,
        'prefer-arrow-callback': 1,
        'no-extra-parens': 1,
        'arrow-parens': [1, "as-needed"],
        'arrow-body-style': ["error", "as-needed"],
        'object-shorthand': 1,
        'no-multiple-empty-lines': 1,
        'no-multi-spaces': 2,
        'prefer-template': 1,
        'callback-return': ["error", ["callback", "cb", "done", "res.send", "utils.badRequest", "utils.sendJsonResponse"]],
        'no-irregular-whitespace': 1,
        'no-else-return': 1,
        'no-empty': 2,
        'no-loop-func': 2,
        'no-mixed-requires': 1,
        'no-new': 2,
        'no-unused-expressions': 2,
        'no-use-before-define': 2,
        'valid-jsdoc': 1,
        'import/no-unresolved': [2, {commonjs: true, amd: true}],
        'import/prefer-default-export': 2,
        'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
        'import/no-duplicates': 2,
        'import/no-deprecated': 2,
        'import/newline-after-import': 1,
        // 'no-useless-return': 1,
        'quote-props': ["error", "as-needed"]
    },
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "mocha": true
    },
    "ecmaFeatures": {
        "blockBindings": true,
        "forOf": true,
        "modules": true
    }
};
