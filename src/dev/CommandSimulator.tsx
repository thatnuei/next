import clsx from "clsx"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { safeJsonParse } from "../common/json"
import Button from "../dom/Button"
import ExternalLink from "../dom/ExternalLink"
import type { ServerCommand } from "../socket/helpers"
import { useSocketActions } from "../socket/SocketConnection"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

type Preset = { name: string } & ServerCommand

const presets: Preset[] = [
  {
    name: "Channel message",
    type: "MSG",
    params: {
      character: "Testificate",
      message: "test message",
      channel: "Development",
    },
  },
  {
    name: "Server broadcast",
    type: "BRO",
    params: {
      character: "Johnathan One",
      message:
        "Greetings! We have an update for everyone in regard to F-List 2.0! Checkout this [url=https://www.f-list.net/newspost/349/]newspost[/url] for new info on the gender systems that are in testing now!",
    },
  },
]

const commandAtom = atomWithStorage("CommandSimulator:command", "")
const paramsAtom = atomWithStorage("CommandSimulator:params", "")

export default function CommandSimulator() {
  const [command, setCommand] = useAtom(commandAtom)
  const [params, setParams] = useAtom(paramsAtom)
  const { callListeners } = useSocketActions()

  const paramsParseResult =
    params.length > 2 ? safeJsonParse(params) : undefined

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (paramsParseResult?.result) {
      callListeners({
        type: command,
        params: paramsParseResult.result,
      } as ServerCommand)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid gap-1">
        <h2>Command Simulator</h2>
        <p className="text-sm">
          Simulate a fake socket command just within the client. Does not send
          any socket messages. This can crash the app if you&apos;re not
          careful!
        </p>
        <p className="text-sm">
          See the{" "}
          <ExternalLink
            href="https://wiki.f-list.net/F-Chat_Server_Commands"
            className="underline"
          >
            wiki
          </ExternalLink>{" "}
          for a list of server commands.
        </p>
      </div>

      <FormField labelText="Preset">
        {/* this should probably be a dropdown, but I'm lazy */}
        <select
          className={select}
          value="Choose preset"
          onChange={(e) => {
            const presetIndex = Number(e.currentTarget.value)
            const preset = presets[presetIndex]
            if (preset) {
              setCommand(preset.type)
              setParams(JSON.stringify(preset.params ?? {}))
            }
          }}
        >
          <option disabled>Choose preset</option>
          {presets.map((preset, index) => (
            <option key={preset.name} value={index}>
              {preset.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField labelText="Command">
        <input
          className={input}
          placeholder="HLO"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
      </FormField>

      <FormField labelText="Params">
        <textarea
          rows={3}
          className={clsx(input, "font-mono resize-y")}
          placeholder='{"message": "hi world"}'
          value={params}
          onChange={(e) => setParams(e.target.value)}
        />
      </FormField>
      <pre className="overflow-x-auto">{paramsParseResult?.error?.message}</pre>
      <div>
        <Button type="submit" className={solidButton}>
          Submit
        </Button>
      </div>
    </form>
  )
}
