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
	// ci sanity check
	if (!process.argv.includes("--skip-ci")) {
		await withSpinner("Running CI checks...", async () => {
			const { stdout, stderr } = await execa("pnpm", ["run", "ci"])
			if (stdout) console.log(stdout)
			if (stderr) console.error(stderr)
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
