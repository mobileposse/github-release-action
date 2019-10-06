# Github Release action

This action scans the repository tags and grabs the latest semver compliant tag. The minor build number is then incremented and a draft release is created.

## Inputs

### `repo_token`

**Required** Github token to use for creating the release

### `version`

**Required** Version to use as a tag for the release

### `zip_filename`

The name of a local zip file to attach to the release

## Example usage

```yaml
uses: mobileposse/github-release-action@v1
with:
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  version: v1.0.0
  zip_filename: 'some_file.zip'
```

## Publishing

Compile a version of `index.js` that includes all dependencies

```
npx ncc build dist/index.js -o lib
```

## Local Testing

```
INPUT_REPO_TOKEN='your token here' GITHUB_REPOSITORY='org/repo' INPUT_FILENAME=somefilename-1.0.0.zip INPUT_VERSION=v1.0.0 node lib/index.js
```
