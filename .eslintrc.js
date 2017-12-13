module.exports = {
    'root': true,
    'parser': 'babel-eslint',
    'parserOptions': {
        sourceType: 'module'
    },
    'env': {
        browser: true
    },
    'extends': 'standard',
    'plugins': [
        'html'
    ],
    'rules': {
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'space-infix-ops': 0,
        'no-return-assign': 0,
        'spaced-comment': 0
    }
};
