import execa from "execa"
import fs from "fs/promises"
import prompts from "prompts"
import * as semver from "semver"
import SimpleGit from "simple-git"
import pkg from "../package.json"

const git = SimpleGit()

async function main() {
	// ci sanity check
	if (!process.argv.includes("--skip-ci")) {
		await execa("pnpm", ["run", "ci"], { stdio: "inherit" })
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

	// check if there are any unstashed files
	const status = await git.status()
	let stash: string | undefined

	if (status.files.length > 0) {
		const { stashingFiles } = (await prompts({
			type: "confirm",
			name: "stashingFiles",
			message: `You have ${status.files.length} changed files. Do you want to stash them?`,
			initial: true,
		})) as { stashingFiles: boolean }

		if (stashingFiles) {
			stash = await git.stash()
		} else {
			return
		}
	}

	// update changelog with messages up until the previous version tag
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

	// open the changelog in the editor for tweaks if necessary
	console.log("Waiting for changelog updates...")
	await execa(process.env.EDITOR || "code", ["--wait", "CHANGELOG.md"], {
		stdio: "inherit",
	})

	// update version
	await fs.writeFile(
		"./package.json",
		JSON.stringify({ ...pkg, version: newVersion }, null, 2),
		"utf8",
	)

	// format
	console.info("Formatting files...")
	await execa("pnpm", ["run", "format"])

	// commit and tag
	await git.add(["package.json", "CHANGELOG.md"])
	await git.commit(`v${newVersion}`)
	await git.tag([`v${newVersion}`])

	// switch to main branch
	await git.checkout("main")

	// merge from dev
	await git.merge(["dev"])

	// push
	await git.push("origin", "main")
	await git.push("origin", "main", ["--tags"])

	// switch back to dev
	await git.checkout("dev")

	// pop stash if we had one
	if (stash) {
		await git.stash(["pop", stash])
	}

	console.log("released! yay ✨")
}

main().catch((error) => {
	console.error(String(error))
	process.exit(1)
})
