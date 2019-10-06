import * as core from '@actions/core'
import * as github from '@actions/github'
const mime = require('mime-types')
const Octokit = require('@octokit/rest')
const fs = require('fs')

async function run() {
  try {
    const token = core.getInput('repo_token', { required: true })
    const version = core.getInput('version', { required: true })
    const client = new github.GitHub(token)

    const uploadUrl = await createRelease(client, version)
    await attachAsset(client, uploadUrl, core.getInput('filename'))
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

const createRelease = async (client: github.GitHub, version: string) => {
  core.info(`Creating new release ${version}`)
  const response = await client.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: version,
    target_commitish: github.context.sha,
    prerelease: true
  })
  const uploadUrl = response.data.upload_url
  console.log(`uploadUrl: ${uploadUrl}`)
  return uploadUrl
}

const attachAsset = async (client: github.GitHub, url: string, filename: string) => {
  const contentLength = fs.statSync(filename).size
  await client.repos.uploadReleaseAsset({
    url,
    file: fs.createReadStream(filename),
    headers: {
      'content-type': mime.lookup(filename),
      'content-length': contentLength
    },
    name: filename
  })
}

run()
