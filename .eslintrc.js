module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    plugins: ['@typescript-eslint'], // Adds TypeScript plugin
    extends: [
        'eslint:recommended', // Enables recommended rules from ESLint
        'plugin:@typescript-eslint/recommended' // Enables recommended rules from @typescript-eslint
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': 'warn', // Warns on unused variables
        '@typescript-eslint/explicit-function-return-type': 'off', // Disables forcing return types
        '@typescript-eslint/no-explicit-any': 'warn', // Warns when using "any" type
        'no-console': 'warn', // Warns about console.log()
        'semi': ['error', 'always'], // Requires semicolons
        'quotes': ['error', 'single'] // Enforces single quotes
    }
};