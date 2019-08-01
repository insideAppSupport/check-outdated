module.exports =  {
	parser:  '@typescript-eslint/parser',
	extends:  [
		'plugin:@typescript-eslint/recommended',
	],
	parserOptions:  {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	env: {
		node: true,
		es6: true
	},
	rules:  {
		// Unused @typescript-eslint Rules
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/no-triple-slash-reference': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'off',

		// Possible Errors
		'for-direction': 'error',
		'getter-return': 'error',
		'no-async-promise-executor': 'error',
		'no-await-in-loop': 'error',
		'no-compare-neg-zero': 'error',
		'no-cond-assign': 'error',
		'no-console': 'error',
		'no-constant-condition': 'error',
		'no-control-regex': 'off',
		'no-debugger': 'error',
		'no-dupe-args': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-empty': 'error',
		'no-empty-character-class': 'error',
		'no-ex-assign': 'error',
		'no-extra-boolean-cast': 'error',
		'no-extra-parens': 'off', /* @todo There should be a option to enforce parens for IIFs */
		'no-extra-semi': 'error',
		'no-func-assign': 'error',
		'no-inner-declarations': 'error',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'error',
		'no-misleading-character-class': 'error',
		'no-obj-calls': 'error',
		'no-prototype-builtins': 'error',
		'no-regex-spaces': 'error',
		'no-sparse-arrays': 'error',
		'no-template-curly-in-string': 'error',
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'error',
		'no-unsafe-finally': 'error',
		'no-unsafe-negation': 'error',
		'require-atomic-updates': 'error',
		'use-isnan': 'error',
		'valid-typeof': 'error',

		// Best Practices
		'accessor-pairs': 'error',
		'array-callback-return': 'error',
		'block-scoped-var': 'error',
		'class-methods-use-this': 'error',
		'complexity': ['error', 20],
		'consistent-return': 'error',
		'curly': 'error',
		'default-case': 'error',
		'dot-location': ['error', 'property'],
		'dot-notation': 'error',
		'eqeqeq': 'error',
		'guard-for-in': 'error',
		'max-classes-per-file': 'error',
		'no-alert': 'error',
		'no-caller': 'error',
		'no-case-declarations': 'error',
		'no-div-regex': 'error',
		'no-else-return': 'error',
		'no-empty-function': 'error',
		'no-empty-pattern': 'error',
		'no-eq-null': 'error',
		'no-eval': 'error',
		'no-extend-native': 'error',
		'no-extra-bind': 'error',
		'no-extra-label': 'error',
		'no-fallthrough': 'error',
		'no-floating-decimal': 'error',
		'no-global-assign': 'error',
		'no-implicit-coercion': 'error',
		'no-implicit-globals': 'error',
		'no-implied-eval': 'error',
		'no-invalid-this': 'error',
		'no-iterator': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-loop-func': 'error',
		'no-magic-numbers': ['error', { ignore: [-3, -2, -1, 0, 1, 2, 3] }],
		'no-multi-spaces': 'error',
		'no-multi-str': 'error',
		'no-new': 'error',
		'no-new-func': 'error',
		'no-new-wrappers': 'error',
		'no-octal': 'error',
		'no-octal-escape': 'error',
		'no-param-reassign': 'error',
		'no-proto': 'error',
		'no-redeclare': 'error',
		'no-restricted-properties': 'error',
		'no-return-assign': 'error',
		'no-return-await': 'error',
		'no-script-url': 'error',
		'no-self-assign': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-throw-literal': 'error',
		'no-unmodified-loop-condition': 'error',
		'no-unused-expressions': 'error',
		'no-unused-labels': 'error',
		'no-useless-call': 'error',
		'no-useless-catch': 'error',
		'no-useless-concat': 'error',
		'no-useless-escape': 'error',
		'no-useless-return': 'error',
		'no-void': 'error',
		'no-warning-comments': 'error',
		'no-with': 'error',
		'prefer-named-capture-group': 'error',
		'prefer-promise-reject-errors': 'error',
		'radix': 'error',
		'require-await': 'error',
		'require-unicode-regexp': 'error',
		'vars-on-top': 'error',
		'wrap-iife': 'error',
		'yoda': 'error',

		// Strict Mode
		'strict': 'error',

		// Variables
		'init-declarations': 'off',
		'no-delete-var': 'error',
		'no-label-var': 'error',
		'no-restricted-globals': 'error',
		'no-shadow': 'error',
		'no-shadow-restricted-names': 'error',
		'no-undef': 'off', // @todo: should be catched by TypeScript. How to do that?
		'no-undef-init': 'error',
		'no-undefined': 'off',
		'no-unused-vars': 'error',
		'no-use-before-define': ['error', 'nofunc'],

		// Node.js and CommonJS
		'callback-return': 'error',
		'global-require': 'error',
		'handle-callback-err': 'error',
		'no-buffer-constructor': 'error',
		'no-mixed-requires': 'error',
		'no-new-require': 'error',
		'no-path-concat': 'error',
		'no-process-env': 'error',
		'no-process-exit': 'off',
		'no-restricted-modules': 'error',
		'no-sync': 'error',

		// Stylistic Issues
		'array-bracket-newline': 'error',
		'array-bracket-spacing': 'error',
		'array-element-newline': ['error', 'consistent'],
		'block-spacing': 'error',
		'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
		'camelcase': 'error',
		'capitalized-comments': 'error',
		'comma-dangle': ['error', 'never'],
		'comma-spacing': 'error',
		'comma-style': 'error',
		'computed-property-spacing': 'error',
		'consistent-this': 'error',
		'eol-last': 'error',
		'func-call-spacing': 'error',
		'func-name-matching': 'error',
		'func-names': 'error',
		'func-style': ['error', 'declaration'],
		'function-paren-newline': ['error', 'multiline'],
		'id-blacklist': 'error',
		'id-length': ['off', { exceptions: ['i', 'x', 'y', 'z'] }],
		'id-match': 'error',
		'implicit-arrow-linebreak': 'error',
		'indent': ['error', 'tab', { SwitchCase: 1, VariableDeclarator: 1, MemberExpression: 1 }],
		'jsx-quotes': 'error',
		'key-spacing': 'error',
		'keyword-spacing': 'error',
		'line-comment-position': 'error',
		'linebreak-style': 'error',
		'lines-around-comment': ['error', { beforeBlockComment: true, beforeLineComment: true, allowBlockStart: true, allowObjectStart: true, allowArrayStart: true, allowClassStart: true }],
		'lines-between-class-members': 'error',
		'max-depth': 'error',
		'max-len': ['error', { code: 160 }],
		'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
		'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
		'max-nested-callbacks': 'error',
		'max-params': ['error', { max: 4 }],
		'max-statements': ['error', 20, { ignoreTopLevelFunctions: true }],
		'max-statements-per-line': ['error', { max: 3 }],
		'multiline-comment-style': 'off', // doesn't work together with "// @ts-ignore"
		'multiline-ternary': ['error', 'always-multiline'],
		'new-cap': 'error',
		'new-parens': 'error',
		'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
		'no-array-constructor': 'error',
		'no-bitwise': 'error',
		'no-continue': 'error',
		'no-inline-comments': 'off', /* @todo JSDoc inline comments must be allowed */
		'no-lonely-if': 'error',
		'no-mixed-operators': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-assign': 'error',
		'no-multiple-empty-lines': 'error',
		'no-negated-condition': 'off',
		'no-nested-ternary': 'error',
		'no-new-object': 'error',
		'no-plusplus': 'off',
		'no-restricted-syntax': 'error',
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'no-ternary': 'off',
		'no-trailing-spaces': 'error',
		'no-underscore-dangle': 'error',
		'no-unneeded-ternary': 'error',
		'no-whitespace-before-property': 'error',
		'nonblock-statement-body-position': 'error',
		'object-curly-newline': 'error',
		'object-curly-spacing': ['error', 'always'],
		'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
		'one-var': ['error', { initialized: 'never', uninitialized: 'always' }],
		'one-var-declaration-per-line': 'error',
		'operator-assignment': 'error',
		'operator-linebreak': 'error',
		'padded-blocks': ['error', 'never'],
		'padding-line-between-statements': 'error',
		'prefer-object-spread': 'error',
		'quote-props': ['error', 'consistent-as-needed'],
		'quotes': ['error', 'single'],
		'semi': 'error',
		'semi-spacing': 'error',
		'semi-style': 'error',
		'sort-keys': 'off',
		'sort-vars': 'error',
		'space-before-blocks': 'error',
		'space-before-function-paren': 'error',
		'space-in-parens': 'error',
		'space-infix-ops': 'error',
		'space-unary-ops': 'error',
		'spaced-comment': ['error', 'always', { markers: ['/'], block: { markers: ['!'], balanced: true } }], // @todo: Remove '/' as soon as we use import instead of require()
		'switch-colon-spacing': 'error',
		'template-tag-spacing': 'error',
		'unicode-bom': 'error',
		'wrap-regex': 'error',

		// ECMAScript 6
		'arrow-body-style': 'error',
		'arrow-parens': 'error',
		'arrow-spacing': 'error',
		'constructor-super': 'error',
		'generator-star-spacing': 'error',
		'no-class-assign': 'error',
		'no-confusing-arrow': 'error',
		'no-const-assign': 'error',
		'no-dupe-class-members': 'error',
		'no-duplicate-imports': 'error',
		'no-new-symbol': 'error',
		'no-restricted-imports': 'error',
		'no-this-before-super': 'error',
		'no-useless-computed-key': 'error',
		'no-useless-constructor': 'error',
		'no-useless-rename': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-arrow-callback': 'error',
		'prefer-const': 'error',
		'prefer-destructuring': 'off',
		'prefer-numeric-literals': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'prefer-template': 'error',
		'require-yield': 'error',
		'rest-spread-spacing': 'error',
		'sort-imports': 'error',
		'symbol-description': 'error',
		'template-curly-spacing': 'error',
		'yield-star-spacing': 'error'
	}
};
