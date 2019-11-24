import * as core from '@actions/core'
import * as github from '@actions/github'
const mime = require('mime-types')
const fs = require('fs')
const path = require('path')

async function run() {
  try {
    const token = core.getInput('repo_token', { required: true })
    const version = core.getInput('version', { required: true })
    const client = new github.GitHub(token)

    const uploadUrl = await createRelease(client, version)
    core.setOutput('upload_url', uploadUrl)
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
    tag_name: `v${version}`,
    target_commitish: github.context.sha,
    prerelease: true
  })
  const uploadUrl = response.data.upload_url
  console.log(`uploadUrl: ${uploadUrl}`)
  return uploadUrl
}

run()
