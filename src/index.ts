import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true })
    const client = new github.GitHub(token)

    console.log('Getting current version number from Github tags')
    const version = await getVersion(client)

    console.log('Creating the new release')
    await createRelease(client, version || 'v0.0.0')

    github.context.sha
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
      return semver.inc(version, 'minor')
    }
  }

  throw new Error('Unable to locate a semver compliant tag')
}

const createRelease = async (client: github.GitHub, version: string) => {
  await client.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: `v${version}`,
    target_commitish: github.context.sha,
    prerelease: true
  })
}

run()
