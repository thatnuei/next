import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { Button } from "../ui/Button"
import { styled } from "../ui/styled"
import { TextArea } from "../ui/TextArea"

export interface ChatboxProps {
  onSubmit: (text: string) => void
}

@observer
export class Chatbox extends React.Component<ChatboxProps> {
  @observable
  value = ""

  @action.bound
  handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault()
      this.submit()
    }
  }

  @action.bound
  handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    this.value = event.currentTarget.value
  }

  @action.bound
  submit() {
    this.props.onSubmit(this.value)
    this.value = ""
  }

  render() {
    return (
      <Container>
        <TextArea
          rows={3}
          value={this.value}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          style={{ resize: "none", width: "initial", flexGrow: 1, marginRight: "4px" }}
        />
        <Button style={{ width: "6rem", textAlign: "center" }} onClick={this.submit}>
          Send
        </Button>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
`
