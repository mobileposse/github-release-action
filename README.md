# Github Release action

This action scans the repository tags and grabs the latest semver compliant tag. The minor build number is then incremented and a draft release is created.

## Inputs

### `repo-token`

**Required** Github token to use for creating the release

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: mobileposse/github-release-action@v1
with:
  repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Local development

Be sure to compile with the specified version of typescript:

```
`npx tsc`
```
