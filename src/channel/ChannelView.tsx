import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import { useMemo } from "react"
import { tw } from "twind"
import BBC from "../bbc/BBC"
import ChatInput from "../chat/ChatInput"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { MessageState } from "../message/MessageState"
import { useRootStore } from "../root/context"
import Drawer from "../ui/Drawer"
import { scrollVertical } from "../ui/helpers"
import Modal from "../ui/Modal"
import { useOverlay } from "../ui/overlay"
import { screenQueries } from "../ui/screens"
import ChannelHeader from "./ChannelHeader"
import ChannelUserList from "./ChannelUserList"
import { useChannel } from "./helpers"

type Props = {
	channelId: string
} & TagProps<"div">

function ChannelView({ channelId, ...props }: Props) {
	const root = useRootStore()
	const channel = useChannel(channelId)
	const messages = useObservable(channel.messages)
	const description = useObservable(channel.description)
	const chatInput = useObservable(channel.chatInput)
	const actualMode = useObservable(channel.actualMode)

	const isLargeScreen = useMediaQuery(screenQueries.large)
	const descriptionOverlay = useOverlay()
	const userList = useOverlay()

	function updateChatInput(chatInput: string) {
		channel.chatInput.set(chatInput)
	}

	function submitChatInput(text: string) {
		root.channelStore.sendMessage(channelId, text)
	}

	const messageList = useMemo(() => {
		function shouldShowMessage(message: MessageState) {
			if (actualMode === "ads") {
				return message.type !== "normal" && message.type !== "action"
			}

			if (actualMode === "chat") {
				return message.type !== "lfrp"
			}

			return true
		}

		return <MessageList messages={messages.filter(shouldShowMessage)} />
	}, [actualMode, messages])

	return (
		<div className={tw`flex flex-col h-full`}>
			<ChannelHeader
				channelId={channelId}
				onToggleDescription={descriptionOverlay.toggle}
				onShowUsers={userList.show}
			/>

			<div className={tw`flex flex-row flex-1 min-h-0 my-1`}>
				<main className={tw`relative flex-1 bg-midnight-1`}>
					{messageList}

					<AnimatePresence>
						{descriptionOverlay.value && (
							<Modal
								title="Description"
								width="100%"
								height="max(60%, 500px)"
								fillMode="contained"
								verticalPanelAlign="top"
								onDismiss={descriptionOverlay.hide}
							>
								<div className={tw([tw`w-full h-full`, scrollVertical])}>
									<p className={tw`p-4`}>
										<BBC text={description} />
									</p>
								</div>
							</Modal>
						)}
					</AnimatePresence>
				</main>

				{isLargeScreen && (
					<div className={tw`w-56 min-h-0 ml-1`}>
						<ChannelUserList channel={channel} />
					</div>
				)}
			</div>

			<ChatInput
				value={chatInput}
				onChangeText={updateChatInput}
				onSubmit={submitChatInput}
			/>

			<AnimatePresence>
				{!isLargeScreen && userList.value && (
					<Drawer side="right" onDismiss={userList.hide}>
						<ChannelUserList
							channel={channel}
							className={tw`w-56 h-full bg-midnight-2`}
						/>
					</Drawer>
				)}
			</AnimatePresence>
		</div>
	)
}

export default ChannelView
