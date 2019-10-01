import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

async function run() {
  try {
    const token = core.getInput('repo_token', { required: true })
    const client = new github.GitHub(token)

    core.info('Getting current version number from Github tags')
    const version = await getVersion(client)
    await createRelease(client, version)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

const getVersion = async (client: github.GitHub) => {
  const tagsResponse = await client.repos.listTags({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    per_page: 100
  })

  const tags = tagsResponse.data.map(t => t.name)

  for (const tag of tags) {
    const version = semver.coerce(tag)
    if (version && semver.valid(version)) {
      const newVersion = semver.inc(version, 'minor') || 'v0.0.0'
      return `v${semver.major(newVersion)}.${semver.minor(newVersion)}`
    }
  }

  throw new Error('Unable to locate a semver compliant tag')
}

const createRelease = async (client: github.GitHub, version: string) => {
  core.info(`Creating new release ${version}`)
  await client.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: version,
    target_commitish: github.context.sha,
    prerelease: true
  })
}

run()
