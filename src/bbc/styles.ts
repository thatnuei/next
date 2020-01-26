import Avatar from "../character/Avatar"
import Icon from "../ui/components/Icon"
import { styled } from "../ui/styled"

const colors: { [color in string]?: string } = {
  white: "rgb(236, 240, 241)",
  black: "rgb(52, 73, 94)",
  red: "rgb(236, 93, 93)",
  blue: "rgb(52, 152, 219)",
  yellow: "rgb(241, 196, 15)",
  green: "rgb(46, 204, 113)",
  pink: "rgb(255,164,156)",
  gray: "rgb(149, 165, 166)",
  orange: "rgb(230, 126, 34)",
  purple: "rgb(201,135,228)",
  brown: "rgb(211, 84, 0)",
  cyan: "rgb(85, 175, 236)",
}

export const Strike = styled.span`
  text-decoration: strike-through;
`

export const Strong = styled.span`
  font-weight: 500;
`

export const Sup = styled.span`
  vertical-align: top;
`

export const Sub = styled.span`
  font-size: 75%;
`

export const Color = styled.span<{ color: string }>`
  color: ${({ color }) => colors[color] || "inherit"};
`

export const LinkIcon = styled(Icon)`
  display: inline;
  margin-right: 2px;

  svg {
    vertical-align: text-top;
    width: 1.2em !important;
  }
`

export const IconImage = styled.img`
  width: 50px;
  height: 50px;
  vertical-align: middle;
`

export const IconAvatar = styled(Avatar)`
  vertical-align: middle;
`
