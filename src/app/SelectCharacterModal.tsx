import React from "react"
import { Button } from "../ui/Button"
import { Form } from "../ui/Form"
import { FormField } from "../ui/FormField"
import { Modal } from "../ui/Modal"
import { styled } from "../ui/styled"

export class SelectCharacterModal extends React.Component {
  render() {
    return (
      <Modal>
        <HeaderText>Select a Character</HeaderText>
        <Form>
          <FormField>
            <div style={{ textAlign: "center" }}>
              <select>
                <option value="test1">test1</option>
                <option value="test2">test2</option>
                <option value="test3">test3</option>
                <option value="test4">test4</option>
              </select>
            </div>
          </FormField>
          <div style={{ textAlign: "center" }}>
            <Button>Enter Chat</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

const HeaderText = styled.h1`
  margin: 1rem 1rem;
  text-align: center;
`
