import { capitalize } from "lodash"
import { observer } from "mobx-react-lite"
import React from "react"
import ChannelModel from "../channel/ChannelModel"
import { ChannelMode } from "../channel/types"
import Box from "../ui/Box"
import { css, styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"

type Props = { channel: ChannelModel }

const ChannelFilters = ({ channel }: Props) => {
  const filterEnabled = channel.mode === "both"

  const getFilterProps = (mode: ChannelMode) => ({
    active: filterEnabled
      ? channel.selectedMode === mode
      : channel.mode === mode,

    children: capitalize(mode),
    disabled: !filterEnabled,
    onClick: () => channel.setSelectedMode(mode),
  })

  return (
    <Box direction="row" style={{ opacity: filterEnabled ? 1 : 0.5 }}>
      <FilterButton {...getFilterProps("both")} />
      <FilterButton {...getFilterProps("chat")} />
      <FilterButton {...getFilterProps("ads")} />
    </Box>
  )
}

export default observer(ChannelFilters)

const FilterButton = styled.button<{ active?: boolean }>`
  transition: 0.2s;
  cursor: pointer;
  padding: 0 ${gapSizes.xsmall};

  :focus {
    background-color: rgba(0, 0, 0, 0.3);
    outline: none;
  }

  :disabled {
    cursor: default;
    pointer-events: none;
  }

  ${(props) => !props.active && inactiveStyle};
`

const inactiveStyle = css`
  opacity: 0.4;
  :hover {
    opacity: 0.7;
  }
`
