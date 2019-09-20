// @ts-check
const { promises: fs } = require("fs")
const path = require("path")

const usage = `Usage: node gen-store-module <module name>`

const rootDir = path.join(__dirname, "..")
const storeFolder = path.join(rootDir, "src/store")

/**
 * @param {string} message
 */
function exitWithUsage(message) {
  if (message) console.log(message)
  console.log(usage)
  process.exit(1)
}

/**
 * @param {import("fs").PathLike} path
 */
async function safeStat(path) {
  try {
    return await fs.stat(path)
  } catch {}
}

/**
 * @param {string} text
 */
function camelize(text) {
  const letterGroups = text.match(/((^|[A-Z])[a-z]*)/g) || []
  return letterGroups
    .map((group) => group[0].toUpperCase() + group.slice(1).toLowerCase())
    .join("")
}

async function main() {
  const moduleName = process.argv[2]
  if (!moduleName) {
    exitWithUsage("Missing module name arg")
  }

  const moduleFolderPath = path.join(storeFolder, moduleName)
  const moduleFolderStat = await safeStat(moduleFolderPath)
  if (moduleFolderStat) {
    exitWithUsage(`Path "${moduleFolderPath}" exists, cannot generate module`)
  }

  const stateTemplate = `export type ${camelize(moduleName)}State = {}

export const state: ${camelize(moduleName)}State = {}
`

  const actionTemplate = `import { Action } from "overmind"
  
export const testAction: Action = () => {
  console.log("test")
}
`

  const indexTemplate = `import * as actions from "./actions"
import { state } from "./state"

export { state, actions }
`

  const namespacesIndexPath = path.join(storeFolder, "namespaces.ts")

  const namespacesIndexContent = await fs.readFile(namespacesIndexPath, "utf-8")

  const namespacesWithNewExport = namespacesIndexContent.replace(
    "export default {",
    `export default {\n  ${moduleName},`,
  )

  const namespacesWithNewImport = `import * as ${moduleName} from './${moduleName}'\n${namespacesWithNewExport}`

  await fs.mkdir(moduleFolderPath)
  await fs.writeFile(path.join(moduleFolderPath, "state.ts"), stateTemplate)
  await fs.writeFile(path.join(moduleFolderPath, "actions.ts"), actionTemplate)
  await fs.writeFile(path.join(moduleFolderPath, "index.ts"), indexTemplate)
  await fs.writeFile(namespacesIndexPath, namespacesWithNewImport)
}

main().catch(console.error)
