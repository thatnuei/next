import createContainer from "constate"
import { get, set } from "idb-keyval"
import { useEffect, useState } from "react"
import { fetchCharacters } from "../flist/api"

export type SessionData = {
  account: string
  ticket: string
  characters: string[]
}

const sessionKey = "session"

function useSessionState() {
  const [sessionData, setSessionData] = useState<SessionData>()

  async function restore() {
    const session = await get<SessionData | undefined>(sessionKey)
    if (session) {
      const { characters } = await fetchCharacters(session.account, session.ticket)
      setSessionData({ ...session, characters })
    }
  }

  useEffect(
    () => {
      set(sessionKey, sessionData)
    },
    [sessionData],
  )

  return {
    data: sessionData,
    setData: setSessionData,
    restore,
  }
}

const SessionContainer = createContainer(useSessionState)
export default SessionContainer
