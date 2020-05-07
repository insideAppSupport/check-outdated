[![npm version](https://badge.fury.io/js/check-outdated.svg)](https://badge.fury.io/js/check-outdated)
[![Dependency Status](https://img.shields.io/david/jens-duttke/check-outdated)](https://www.npmjs.com/package/check-outdated)
[![Known Vulnerabilities](https://snyk.io/test/github/jens-duttke/check-outdated/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jens-duttke/check-outdated?targetFile=package.json)
[![npm](https://img.shields.io/npm/dm/check-outdated.svg?maxAge=2592000)](https://www.npmjs.com/package/check-outdated)
[![node](https://img.shields.io/node/v/check-outdated)](https://www.npmjs.com/package/check-outdated)
[![MIT license](https://img.shields.io/github/license/jens-duttke/check-outdated.svg?style=flat)](https://opensource.org/licenses/MIT)

# check-outdated

Ensures that your dependencies are up-to-date, otherwise the process is terminated with status code 1.

This is an improved version of `npm outdated`, which can be used in build-pipelines, pre-publish scripts (npm) or pre-commit hook (Git) to make sure all the used dependencies are up-to-date.

- Zero dependencies
- Optionally ignore pre-releases (e.g. "2.1.0-alpha", "2.1.0-beta", "2.1.0-rc.1")
- Optionally ignore dev dependencies
- Optionally ignore specific packages
- Optionally ignore a specific version of a package (e.g. to skip a broken version)
- Optionally check globally installed packages
- Optionally set depth for checking dependency tree
- Show link to changelogs
- Configure visible columns

## Example Screenshot

<img src="https://cdn.jsdelivr.net/gh/jens-duttke/check-outdated@abe907d/screenshot.png" width="100%" />

## Install

```sh
npm install check-outdated --save-dev
```

### Usage

On command-line you can run the command like this:
```sh
node_modules/.bin/check-outdated --ignore-pre-releases --ignore-dev-dependencies --ignore-packages package1,package2 --columns name,type,current,latest,changes
```

Or put it into your `package.json`:
```json
{
  "scripts": {
    "check-outdated": "check-outdated --ignore-pre-releases --ignore-dev-dependencies --ignore-packages package1,package2 --columns name,type,current,latest,changes",
    "preversion": "npm run lint && npm run test && npm run check-outdated"
  }
}
```

| Argument | Description | Example |
|-|-|-|
| --help, -h | Show the help | `--help` |
| --ignore-pre-releases | Don't recommend to update to the latest version, if it contains a hyphen (e.g. "2.1.0-alpha", "2.1.0-beta", "2.1.0-rc.1") | `--ignore-pre-releases` |
| --ignore-dev-dependencies | Do not warn if devDependencies are outdated. | `--ignore-dev-dependencies` |
| --ignore-packages \<comma-separated-list-of-package-names\> | Ignore the listed packages, even if they are outdated.<br />Using the `@` syntax (`<package>@<version>`) you can also, only ignore a specific version of a package (e.g. if it's broken). | `--ignore-packages typescript,terser-webpack-plugin@3.0.0` |
| --columns \<comma-separated-list-of-columns\> | Defines which columns should be shown in which order. (See [Available Columns](#available-columns) below) | `--columns name,current,latest,changes` |
| --global | Check packages in the global install prefix instead of in the current project (equal to the npm outdated-option) | `--global` |
| --depth \<number\> | Max depth for checking dependency tree (equal to the npm outdated-option) | `--depth 3` |

### Available Columns

By default, the following columns are shown:  
`name`, `current`, `wanted`, `latest`, `type`, `location`, `packageType`, `changes`

You are able to overwrite the default by using the `--columns` argument.

| Caption | --columns value | Description | Example |
|-|-|-|-|
| Package | `name` | The name of the package.<br />**Red** means there's a newer version matching your semver requirements, so you should update now.<br />**Yellow** indicates that there's a newer version above your semver requirements (usually new major, or new 0.x minor) so proceed with caution. | typescript |
| Current | `current` | The currently installed version of the package. | 3.<u>7</u>.<u>2</u> |
| Wanted | `wanted` | The maximum version of the package that satisfies the semver range specified in **package.json**. If there's no available semver range (i.e. you're using the `--global` argument, or the package isn't included in **package.json**), then **wanted** shows the currently-installed version.<br />This column is always colored in **green**. | 3.7.2 |
| Latest | `latest` | The version of the package tagged as latest in the npm registry.<br />This column is always colored in **magenta**. | 3.<u>8</u>.<u>3</u> |
| Type | `type` | Shows if the difference between **Current** and **Latest** is a `major`, `minor` or `patch` update, in Semantic Versioning. | minor |
| Location | `location` | Shows where in the dependency tree the package is located. Note that **check-outdated** defaults to a depth of 0, so unless you override that, you'll always be seeing only top-level dependencies that are outdated. | node_modules/typescript |
| Package Type | `packageType` | Tells you whether this package is a `dependency` or a `devDependency`. Packages not included in **package.json** are always marked dependencies. | devDependencies |
| Changes | `changes` | **check-outdated** tries to find a direct link to changelog of the package. The following places are considered in the given order:<ol><li>{package}/package.json > "repository" \*</li><li>{package}/package.json > "homepage"</li><li>`https://www.npmjs.com/package/{name}`</li></ol>\* GitHub-repository URLs are adjusted, so that they directly link to the **Releases** section. | https<span>:</span>//github<span>.</span>com/Microsoft/TypeScript/releases |
| Changes | `changesPreferLocal` | Same as `changes`, but first check for a CHANGELOG<span>.</span>md in the package folder.<br />Keep in mind, you'll only see the changelog of the currently installed version, not of the version which is recommended. | node_modules/fs-extra/CHANGELOG.md |
| Homepage | `homepage` | An URL with additional information to the package. The following places are considered in the given order:<ol><li>{package}/package.json > "homepage"</li><li>{package}/package.json > "repository"</li><li>{package}/package.json > "author"</li><li>`https://www.npmjs.com/package/{name}`</li></ol> | https<span>:</span>//www<span>.</span>typescriptlang<span>.</span>org/ |
| npmjs<span>.</span>com | `npmjs` | A link to the package on the npmjs.com website. | https<span>:</span>//www<span>.</span>npmjs<span>.</span>com/package/typescript |

