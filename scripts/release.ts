/* eslint-disable no-console */
import execa from "execa"
import fs from "fs/promises"
import ora from "ora"
import prompts from "prompts"
import * as semver from "semver"
import SimpleGit from "simple-git"
import pkg from "../package.json"

const git = SimpleGit()

async function withSpinner<T>(
  message: string,
  block: () => Promise<T>,
): Promise<T> {
  const spinner = ora({ text: message })
  spinner.start()

  try {
    const result = await block()
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail()
    throw error
  }
}

async function main() {
  const status = await git.status()

  if (status.current !== "dev") {
    console.error("Switch to the dev branch before continuing")
    return
  }

  if (status.files.length > 0) {
    console.log(
      "Found unchanged files! Commit or stash them before continuing.",
    )
    return
  }

  // ci sanity check
  if (!process.argv.includes("--skip-ci")) {
    await withSpinner("Running CI checks...", async () => {
      const { stdout, exitCode } = await execa("pnpm", ["run", "ci"])
      if (exitCode !== 0) {
        console.error(stdout)
        throw new Error("CI checks failed")
      }
    })
  }

  // get new version
  const { newVersion } = (await prompts({
    type: "text",
    name: "newVersion",
    message: `New version:`,
    initial: semver.inc(pkg.version, "patch") ?? undefined,
    validate: (value: string) => {
      const version = semver.valid(value)
      if (!version) {
        return `Invalid version: ${value}`
      }
      if (semver.lte(version, pkg.version)) {
        return `Version must be greater than the current version (${pkg.version})`
      }
      return true
    },
  })) as { newVersion: string }

  await withSpinner("Updating changelog with commits...", async () => {
    const log = await git.log({ from: `v${pkg.version}`, to: "HEAD" })
    const messages = log.all
      .slice()
      .reverse()
      .map((commit) => `- ${commit.message}`)
      .join("\n")

    const changelogContent = await fs.readFile("./CHANGELOG.md", "utf8")
    await fs.writeFile(
      "./CHANGELOG.md",
      changelogContent.replace(
        "<!--new-version-->",
        `<!--new-version-->\n\n## ${newVersion}\n\n${messages}`,
      ),
    )
  })

  await withSpinner("Waiting for changelog updates...", async () => {
    await execa(process.env.EDITOR || "code", ["--wait", "CHANGELOG.md"], {
      stdio: "inherit",
    })
  })

  await withSpinner("Updating package.json...", async () => {
    await fs.writeFile(
      "./package.json",
      JSON.stringify({ ...pkg, version: newVersion }, null, 2),
      "utf8",
    )
  })

  await withSpinner("Formatting code...", async () => {
    await execa("pnpm", ["run", "format"])
  })

  await withSpinner("Committing and tagging...", async () => {
    await git.add(["package.json", "CHANGELOG.md"])
    await git.commit(`v${newVersion}`)
    await git.tag([`v${newVersion}`])
  })

  await withSpinner("Merging and pushing from main...", async () => {
    await git.checkout("main")

    await git.merge(["dev"])

    await git.push("origin", "main")
    await git.push("origin", "main", ["--tags"])

    await git.checkout("dev")
  })

  console.log("released! yay ✨")
}

main().catch((maybeError) => {
  const error =
    maybeError instanceof Error ? maybeError : new Error(String(maybeError))

  console.error(error.message)
  process.exit(1)
})
