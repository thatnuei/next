import * as React from "react"

function BellBadgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      style={{
        width: 24,
        height: 24,
      }}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M21 6.5c0 1.93-1.57 3.5-3.5 3.5S14 8.43 14 6.5 15.57 3 17.5 3 21 4.57 21 6.5m-2 5.29c-.5.13-1 .21-1.5.21A5.51 5.51 0 0112 6.5c0-1.47.58-2.8 1.5-3.79A1.93 1.93 0 0012 2c-1.1 0-2 .9-2 2v.29C7.03 5.17 5 7.9 5 11v6l-2 2v1h18v-1l-2-2v-5.21M12 23c1.11 0 2-.89 2-2h-4a2 2 0 002 2z"
      />
    </svg>
  )
}

export default React.memo(BellBadgeIcon)
