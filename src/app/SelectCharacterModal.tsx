import React from "react"
import { sessionStore } from "../session/SessionStore"
import { Button } from "../ui/Button"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Modal } from "../ui/Modal"
import { styled } from "../ui/styled"

export class SelectCharacterModal extends React.Component {
  render() {
    return (
      <Modal>
        <ContentContainer>
          <HeaderText>Select a Character</HeaderText>
          <Form>
            <FormField>
              <div style={{ textAlign: "center" }}>
                <select>
                  {sessionStore.characters.map((name) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>
            <div style={{ textAlign: "center" }}>
              <Button>Enter Chat</Button>
            </div>
          </Form>
        </ContentContainer>
      </Modal>
    )
  }
}

const ContentContainer = styled.div`
  padding: 1rem;
`

const HeaderText = styled.h1`
  margin-bottom: 1rem;
`
