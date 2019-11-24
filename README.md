# Github Release action

This action tags and creates a new Github release based on the provided inputs.

## Inputs

### `repo_token`

**Required** Github token to use for creating the release

### `version`

**Required** Version to use as a tag for the release

## Outputs

### `upload_url`

The url to use for uploading artifacts to the release

## Example usage

```yaml
uses: mobileposse/github-release-action@v1
with:
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  version: v1.0.0
```

## Publishing

Compile a version of `index.js` that includes all dependencies

```
npx ncc build dist/index.js -o lib
```

## Local Testing

```
INPUT_REPO_TOKEN='your token here' GITHUB_REPOSITORY='org/repo' INPUT_VERSION=v1.0.0 node lib/index.js
```
