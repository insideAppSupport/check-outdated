/**
 * @file Different tests to verify everything works correctly.
 */

/* eslint-disable max-lines-per-function, max-len, @typescript-eslint/no-magic-numbers */

const assert = require('assert').strict;

const colorize = require('./helper/colorize');
const { describe } = require('./helper/describe');
const { expect, expectNoOfAffectedDependencies, expectVarToEqual, expectVarToHaveWord, expectVarNotToHaveWord, getExpectResult } = require('./helper/expect');
const { setMocks, test } = require('./helper/test');

/**
 * @typedef {object} MockData
 * @property {{ [dependencyName: string]: Partial<import('../check-outdated').OutdatedDependency>; }} defaultResponse
 * @property {{ [path: string]: boolean; }} fsExists
 * @property {{ [path: string]: string | import('../helper/files').PackageJSON; }} fsReadFile
 * @property {Partial<import('http').IncomingMessage>} httpsGet
 */

const mockData = /** @type {MockData} */(require('./mock-data.json'));

void (async () => {
	setMocks(mockData);

	await describe('-h / --help arguments', async () => {
		await test('should show help', ['-h'], {}, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Arguments:');
		});

		await test('should show help', ['--help'], {}, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Arguments:');
		});
	});

	await describe('Invalid npm response', async () => {
		await test('should catch npm error', [], { error: { code: 'TEST', summary: 'Test error' } }, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expect('`stdout` should contain the correct output', () => assert.equal(stdout, '\u001b[31mError while gathering outdated dependencies:\u001b[39m\n\n\u001b[35mcode\u001b[39m TEST\n\u001b[35msummary\u001b[39m Test error\n'));
		});

		await test('should catch JSON.parse() error', [], '{ "Incomplete JSON response', (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Error while gathering outdated dependencies:');
			expectVarToHaveWord(stdout, 'Unexpected end of JSON input');
			expectVarToHaveWord(stdout, '{ "Incomplete JSON response');
		});

		await test('should throw "Unexpected JSON response" error for string response', [], '"string"', (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Error while gathering outdated dependencies:');
			expectVarToHaveWord(stdout, 'Unexpected JSON response');
			expectVarToHaveWord(stdout, '"string"');
		});

		await test('should catch "Unexpected JSON response" error for null response', [], 'null', (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Error while gathering outdated dependencies:');
			expectVarToHaveWord(stdout, 'Unexpected JSON response');
			expectVarToHaveWord(stdout, 'null');
		});

		await test('should return without outdated dependency message for empty response', [], '', (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 0);

			expectVarToEqual(stdout, 'All dependencies are up-to-date.\n');
		});

		await test('should return without outdated dependency message for empty object response', [], {}, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 0);

			expectVarToEqual(stdout, 'All dependencies are up-to-date.\n');
		});
	});

	await describe('Invalid arguments', async () => {
		await test('should return with an "Unknown argument" message, for a single argument', ['--unknown-argument'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Unknown argument: --unknown-argument');
		});

		await test('should return with an "Unknown argument"  message, for multiple arguments', ['--unknown-argument1', '--unknown-argument2'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Unknown arguments: --unknown-argument1, --unknown-argument2');
		});
	});

	await describe('--ignore-dev-dependencies argument', async () => {
		await test('should return with outdated dependency message, ignoring pre-releases', ['--ignore-pre-releases'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 1);

			expectVarNotToHaveWord(stdout, 'module-prerelease');
		});
	});

	await describe('--ignore-dev-dependencies argument', async () => {
		await test('should return with outdated non-dev-dependency message, ignoring dev-dependencies', ['--ignore-dev-dependencies'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 1);

			expectVarNotToHaveWord(stdout, 'module-dev-major');
		});
	});

	await describe('--ignore-packages argument', async () => {
		await test('should return with outdated dependency message, ignoring package `"module-major"` and `"module-minor"`', ['--ignore-packages', 'module-major,module-minor'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 2);

			expectVarNotToHaveWord(stdout, 'module-major');
			expectVarNotToHaveWord(stdout, 'module-minor');
		});

		await test('should return with outdated dependency message, ignoring package `"module-major"` and `"module-minor"`', ['--ignore-packages', 'module-major,module-minor'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 2);

			expectVarNotToHaveWord(stdout, 'module-major');
			expectVarNotToHaveWord(stdout, 'module-minor');
		});

		await test('should return with outdated dependency message, ignoring package `"module-broken-version"`', ['--ignore-packages', 'module-broken-version@2.3.4'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 1);

			expectVarNotToHaveWord(stdout, 'module-broken-version');
		});

		await test('should return with outdated dependency message, informing about an unnecessary ignore of package `"module-broken-version"`', ['--ignore-packages', 'module-broken-version@2.3.3'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 0);

			expectVarToHaveWord(stdout, '\u001b[33mmodule-broken-version\u001b[39m', false);
			expectVarToHaveWord(stdout, 'The --ignore-packages filter "module-broken-version@2.3.3" has no effect, the latest version is 2.3.4.');
		});

		await test('should return with outdated dependency message, ignoring package `"@scoped/module-sub-broken-version"`', ['--ignore-packages', '@scoped/module-sub-broken-version@2.3.4'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 1);

			expectVarNotToHaveWord(stdout, '@scoped/module-sub-broken-version');
		});

		await test('should return with outdated dependency message, informing about an unnecessary ignore of package `"@scoped/module-sub-broken-version"`', ['--ignore-packages', '@scoped/module-sub-broken-version@2.3.3'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 0);

			expectVarToHaveWord(stdout, '\u001b[33m@scoped/module-sub-broken-version\u001b[39m', false);
			expectVarToHaveWord(stdout, 'The --ignore-packages filter "@scoped/module-sub-broken-version@2.3.3" has no effect, the latest version is 2.3.4.');
		});

		await test('should return with the help indicating an argument problem', ['--ignore-packages'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid value of --ignore-packages');
		});
	});

	await describe('--columns argument', async () => {
		await test('should return with outdated dependency message and all available columns', ['--columns', 'name,current,wanted,latest,type,location,packageType,reference,changes,changesPreferLocal,homepage,npmjs'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 0);

			expect('`stdout` should contain the correct output', () => assert.equal(
				stdout.replace(/\x20+(\n|$)/gu, '$1'),
				[
					'33 outdated dependencies found:',
					'',
					'\u001b[4mPackage\u001b[24m                                                    \u001b[4mCurrent\u001b[24m  \u001b[4mWanted\u001b[24m         \u001b[4mLatest\u001b[24m  \u001b[4mType\u001b[24m        \u001b[4mLocation\u001b[24m                                                                     \u001b[4mPackage Type\u001b[24m     \u001b[4mReference\u001b[24m         \u001b[4mChanges\u001b[24m                                                                             \u001b[4mChanges\u001b[24m                                                                             \u001b[4mHomepage\u001b[24m                                                                            \u001b[4mnpmjs.com\u001b[24m',
					'\u001b[33mmodule-major\u001b[39m                                                 \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-major                                                    dependencies     package.json:3:5  https://www.npmjs.com/package/module-major                                          https://www.npmjs.com/package/module-major                                          https://www.npmjs.com/package/module-major                                          https://www.npmjs.com/package/module-major',
					'\u001b[33mmodule-minor\u001b[39m                                                 1.\u001b[4m0\u001b[24m.0   \u001b[32m1.0.0\u001b[39m          \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35;4m1\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  minor       node_modules/module-minor                                                    dependencies     package.json:4:5  https://www.npmjs.com/package/module-minor                                          https://www.npmjs.com/package/module-minor                                          https://www.npmjs.com/package/module-minor                                          https://www.npmjs.com/package/module-minor',
					'\u001b[33mmodule-patch\u001b[39m                                                 1.0.\u001b[4m0\u001b[24m   \u001b[32m1.0.0\u001b[39m          \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35;4m1\u001b[39;24m  patch       node_modules/module-patch                                                    dependencies     package.json:5:5  https://www.npmjs.com/package/module-patch                                          https://www.npmjs.com/package/module-patch                                          https://www.npmjs.com/package/module-patch                                          https://www.npmjs.com/package/module-patch',
					'\u001b[33mmodule-prerelease\u001b[39m                                            1.0.0   \u001b[32m1.0.0\u001b[39m  \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35;4m-\u001b[39;24m\u001b[35;4malpha\u001b[39;24m\u001b[35;4m.\u001b[39;24m\u001b[35;4m1\u001b[39;24m  prerelease  node_modules/module-prelease                                                 dependencies     package.json:6:5  https://www.npmjs.com/package/module-prerelease                                     https://www.npmjs.com/package/module-prerelease                                     https://www.npmjs.com/package/module-prerelease                                     https://www.npmjs.com/package/module-prerelease',
					'\u001b[33mmodule-build\u001b[39m                                                 1.0.0   \u001b[32m1.0.0\u001b[39m    \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35;4m+\u001b[39;24m\u001b[35;4mbuild\u001b[39;24m  build       node_modules/module-build                                                    dependencies     package.json:7:5  https://www.npmjs.com/package/module-build                                          https://www.npmjs.com/package/module-build                                          https://www.npmjs.com/package/module-build                                          https://www.npmjs.com/package/module-build',
					'\u001b[33mmodule-sub-version\u001b[39m                                           1.0.0   \u001b[32m1.0.0\u001b[39m        \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35;4m.\u001b[39;24m\u001b[35;4m1\u001b[39;24m              node_modules/module-sub-version                                              dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-sub-version                                    https://www.npmjs.com/package/module-sub-version                                    https://www.npmjs.com/package/module-sub-version                                    https://www.npmjs.com/package/module-sub-version',
					'\u001b[33mmodule-revert\u001b[39m                                                1.\u001b[4m1\u001b[24m.0   \u001b[32m1.1.0\u001b[39m          \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35;4m0\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m              node_modules/module-revert                                                   dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-revert                                         https://www.npmjs.com/package/module-revert                                         https://www.npmjs.com/package/module-revert                                         https://www.npmjs.com/package/module-revert',
					'\u001b[33mmodule-broken-version\u001b[39m                                        \u001b[4m1\u001b[24m.\u001b[4m0\u001b[24m.\u001b[4m0\u001b[24m   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35;4m3\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35;4m4\u001b[39;24m  major       node_modules/module-patch                                                    dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-broken-version                                 https://www.npmjs.com/package/module-broken-version                                 https://www.npmjs.com/package/module-broken-version                                 https://www.npmjs.com/package/module-broken-version',
					'\u001b[33m@scoped/module-sub-broken-version\u001b[39m                            \u001b[4m1\u001b[24m.\u001b[4m0\u001b[24m.\u001b[4m0\u001b[24m   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35;4m3\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35;4m4\u001b[39;24m  major       node_modules/module-patch                                                    dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/%40scoped%2Fmodule-sub-broken-version                 https://www.npmjs.com/package/%40scoped%2Fmodule-sub-broken-version                 https://www.npmjs.com/package/%40scoped%2Fmodule-sub-broken-version                 https://www.npmjs.com/package/%40scoped%2Fmodule-sub-broken-version',
					'\u001b[31mmodule-no-current-version\u001b[39m                                  \u001b[90munknown\u001b[39m   \u001b[32m4.0.0\u001b[39m          \u001b[35;4m4\u001b[39;24m\u001b[35;4m.\u001b[39;24m\u001b[35;4m0\u001b[39;24m\u001b[35;4m.\u001b[39;24m\u001b[35;4m0\u001b[39;24m              node_modules/module-no-current-version                                       dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-no-current-version                             https://www.npmjs.com/package/module-no-current-version                             https://www.npmjs.com/package/module-no-current-version                             https://www.npmjs.com/package/module-no-current-version',
					'\u001b[33mmodule-without-properties\u001b[39m                                  \u001b[90munknown\u001b[39m        \u001b[32m\u001b[39m               \u001b[35m\u001b[39m              node_modules/module-without-properties                                                        \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-without-properties                             https://www.npmjs.com/package/module-without-properties                             https://www.npmjs.com/package/module-without-properties                             https://www.npmjs.com/package/module-without-properties',
					'\u001b[33mmodule-non-semver\u001b[39m                                               \u001b[4mR1\u001b[24m      \u001b[32mR1\u001b[39m             \u001b[35;4mR2\u001b[39;24m              node_modules/module-non-semver                                               dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-non-semver                                     https://www.npmjs.com/package/module-non-semver                                     https://www.npmjs.com/package/module-non-semver                                     https://www.npmjs.com/package/module-non-semver',
					'\u001b[31mmodule-diff-wanted\u001b[39m                                           1.\u001b[4m0\u001b[24m.0   \u001b[32m1.1.0\u001b[39m          \u001b[35m1\u001b[39m\u001b[35m.\u001b[39m\u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  minor       node_modules/module-diff-wanted                                              dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-diff-wanted                                    https://www.npmjs.com/package/module-diff-wanted                                    https://www.npmjs.com/package/module-diff-wanted                                    https://www.npmjs.com/package/module-diff-wanted',
					'\u001b[33mmodule-dev-major\u001b[39m                                             \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-dev-major                                                devDependencies  \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-dev-major                                      https://www.npmjs.com/package/module-dev-major                                      https://www.npmjs.com/package/module-dev-major                                      https://www.npmjs.com/package/module-dev-major',
					'\u001b[33mmodule-absolute-unix-path\u001b[39m                                    \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       /home/user/node_modules/module-absolute-unix-path                            dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-absolute-unix-path                             https://www.npmjs.com/package/module-absolute-unix-path                             https://www.npmjs.com/package/module-absolute-unix-path                             https://www.npmjs.com/package/module-absolute-unix-path',
					'\u001b[33mmodule-absolute-windows-path\u001b[39m                                 \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\module-absolute-windows-path  dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-absolute-windows-path                          https://www.npmjs.com/package/module-absolute-windows-path                          https://www.npmjs.com/package/module-absolute-windows-path                          https://www.npmjs.com/package/module-absolute-windows-path',
					'\u001b[33mmodule-with-homepage\u001b[39m                                         \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-homepage                                            dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-homepage                                  https://www.npmjs.com/package/module-with-homepage                                  https://www.duttke.de                                                               https://www.npmjs.com/package/module-with-homepage',
					'\u001b[33mmodule-with-changelog\u001b[39m                                        \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-changelog                                           dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-changelog                                 node_modules/module-with-changelog/CHANGELOG.md                                     https://www.npmjs.com/package/module-with-changelog                                 https://www.npmjs.com/package/module-with-changelog',
					'\u001b[33mmodule-with-package-json-with-homepage-and-author\u001b[39m            \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-homepage-and-author               dependencies     \u001b[90m-\u001b[39m                 https://www.duttke.de/#homepage                                                     https://www.duttke.de/#homepage                                                     https://www.duttke.de/#homepage                                                     https://www.npmjs.com/package/module-with-package-json-with-homepage-and-author',
					'\u001b[33mmodule-with-package-json-with-repository-and-author\u001b[39m          \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-repository-and-author             dependencies     \u001b[90m-\u001b[39m                 https://www.duttke.de/#git                                                          https://www.duttke.de/#git                                                          https://www.duttke.de/#git                                                          https://www.npmjs.com/package/module-with-package-json-with-repository-and-author',
					'\u001b[33mmodule-with-package-json-with-github-repository\u001b[39m              \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-github-repository                 dependencies     \u001b[90m-\u001b[39m                 https://github.com/jens-duttke/check-outdated/blob/master/CHANGELOG.md              https://github.com/jens-duttke/check-outdated/blob/master/CHANGELOG.md              https://github.com/jens-duttke/check-outdated/blob/master/README.md                 https://www.npmjs.com/package/module-with-package-json-with-github-repository',
					'\u001b[33mmodule-with-package-json-with-github-repository2\u001b[39m             \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-github-repository2                dependencies     \u001b[90m-\u001b[39m                 https://github.com/jens-duttke/check-outdated/blob/master/CHANGELOG.md              https://github.com/jens-duttke/check-outdated/blob/master/CHANGELOG.md              https://github.com/jens-duttke/check-outdated                                       https://www.npmjs.com/package/module-with-package-json-with-github-repository2',
					'\u001b[33mmodule-with-package-json-with-github-repository-string\u001b[39m       \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-github-repository-string          dependencies     \u001b[90m-\u001b[39m                 https://github.com/user/repo/releases                                               https://github.com/user/repo/releases                                               https://github.com/user/repo                                                        https://www.npmjs.com/package/module-with-package-json-with-github-repository-string',
					'\u001b[33mmodule-with-package-json-with-gist-repository-string\u001b[39m         \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-gist-repository-string            dependencies     \u001b[90m-\u001b[39m                 https://gist.github.com/11081aaa281/revisions                                       https://gist.github.com/11081aaa281/revisions                                       https://gist.github.com/11081aaa281                                                 https://www.npmjs.com/package/module-with-package-json-with-gist-repository-string',
					'\u001b[33mmodule-with-package-json-with-bitbucket-repository-string\u001b[39m    \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-bitbucket-repository-string       dependencies     \u001b[90m-\u001b[39m                 https://bitbucket.org/user/repo                                                     https://bitbucket.org/user/repo                                                     https://bitbucket.org/user/repo                                                     https://www.npmjs.com/package/module-with-package-json-with-bitbucket-repository-string',
					'\u001b[33mmodule-with-package-json-with-gitlab-repository-string\u001b[39m       \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-gitlab-repository-string          dependencies     \u001b[90m-\u001b[39m                 https://gitlab.com/user/repo/-/releases                                             https://gitlab.com/user/repo/-/releases                                             https://gitlab.com/user/repo                                                        https://www.npmjs.com/package/module-with-package-json-with-gitlab-repository-string',
					'\u001b[33mmodule-with-package-json-with-repository-without-url\u001b[39m         \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-repository-without-url            dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-package-json-with-repository-without-url  https://www.npmjs.com/package/module-with-package-json-with-repository-without-url  https://www.npmjs.com/package/module-with-package-json-with-repository-without-url  https://www.npmjs.com/package/module-with-package-json-with-repository-without-url',
					'\u001b[33mmodule-with-package-json-with-author\u001b[39m                         \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-author                            dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-package-json-with-author                  https://www.npmjs.com/package/module-with-package-json-with-author                  https://www.duttke.de/#author                                                       https://www.npmjs.com/package/module-with-package-json-with-author',
					'\u001b[33mmodule-with-package-json-with-author-without-url\u001b[39m             \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-author-without-url                dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-package-json-with-author-without-url      https://www.npmjs.com/package/module-with-package-json-with-author-without-url      https://www.npmjs.com/package/module-with-package-json-with-author-without-url      https://www.npmjs.com/package/module-with-package-json-with-author-without-url',
					'\u001b[33mmodule-with-package-json-with-author-string\u001b[39m                  \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-author-string                     dependencies     \u001b[90m-\u001b[39m                 https://www.npmjs.com/package/module-with-package-json-with-author-string           https://www.npmjs.com/package/module-with-package-json-with-author-string           https://www.duttke.de/#author                                                       https://www.npmjs.com/package/module-with-package-json-with-author-string',
					'\u001b[33mmodule-with-package-json-with-homepage-and-repository\u001b[39m        \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-package-json-with-homepage-and-repository           dependencies     \u001b[90m-\u001b[39m                 https://www.duttke.de/#git                                                          https://www.duttke.de/#git                                                          https://www.duttke.de/#homepage                                                     https://www.npmjs.com/package/module-with-package-json-with-homepage-and-repository',
					'\u001b[33mmodule-with-empty-changelog\u001b[39m                                  \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/module-with-empty-changelog                                     dependencies     \u001b[90m-\u001b[39m                 https://github.com/jens-duttke/empty-changelog/releases                             https://github.com/jens-duttke/empty-changelog/releases                             https://github.com/jens-duttke/empty-changelog/blob/master/README.md                https://www.npmjs.com/package/module-with-empty-changelog',
					'\u001b[33m@scoped/module\u001b[39m                                               \u001b[4m1\u001b[24m.0.0   \u001b[32m1.0.0\u001b[39m          \u001b[35;4m2\u001b[39;24m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m\u001b[35m.\u001b[39m\u001b[35m0\u001b[39m  major       node_modules/@scoped/module                                                  dependencies     package.json:8:5  https://www.npmjs.com/package/%40scoped%2Fmodule                                    https://www.npmjs.com/package/%40scoped%2Fmodule                                    https://www.npmjs.com/package/%40scoped%2Fmodule                                    https://www.npmjs.com/package/%40scoped%2Fmodule',
					'',
					''
				].join('\n')
			));

			/*
				For testing purpose:
				console.log(stdout);
				require('fs').writeFileSync('stdout.txt', stdout.split('\n').map((line) => JSON.stringify(line.replace(/\x20+$/gu, '')).replace(/^"|"$/gu, '\'')).join(',\n'), 'utf8');
			*/
		});

		await test('should return with outdated dependency message', ['--columns', 'INVALID'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid column name "INVALID" in --columns');
		});

		await test('should return with the help indicating an argument problem', ['--columns', 'name,INVALID1,INVALID2'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid column name "INVALID1" in --columns');
			expectVarNotToHaveWord(stdout, 'Invalid column name "INVALID2" in --columns');
		});

		await test('should return with the help indicating an argument problem', ['--columns'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid value of --columns');
		});
	});

	await describe('--global argument', async () => {
		await test('should return with outdated dependency message', ['--global'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false --global');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 0);
		});
	});

	await describe('--depth argument', async () => {
		// @todo Improve this test by adding modules with deeper node_modules-structure
		await test('should return with outdated dependency message', ['--depth', '10'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false --depth 10');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 0);
		});

		await test('should return with the help indicating an argument problem', ['--depth', 'INVALID'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid value of --depth');
		});

		await test('should return with the help indicating an argument problem', ['--depth'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, undefined);
			expectVarToEqual(exitCode, 1);

			expectVarToHaveWord(stdout, 'Invalid value of --depth');
		});
	});

	await describe('All arguments', async () => {
		await test('should return with outdated dependency message if all options are activated', ['--ignore-pre-releases', '--ignore-dev-dependencies', '--ignore-packages', 'module-major,module-minor', '--global', '--depth', '10'], mockData.defaultResponse, (command, exitCode, stdout) => {
			expectVarToEqual(command, 'npm outdated --json --long --save false --global --depth 10');
			expectVarToEqual(exitCode, 1);

			expectNoOfAffectedDependencies(stdout, mockData.defaultResponse, 4);

			expectVarNotToHaveWord(stdout, 'module-major');
			expectVarNotToHaveWord(stdout, 'module-minor');
			expectVarNotToHaveWord(stdout, 'module-prerelease');
			expectVarNotToHaveWord(stdout, 'module-dev-major');
		});
	});

	const sum = getExpectResult();

	console.log();
	console.log(colorize.green(`${sum.passed} passed`));
	if (sum.failed > 0) {
		console.log(colorize.red(`${sum.failed} failed`));

		process.exitCode = 1;
	}
	console.log();
})();
