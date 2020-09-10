import React from 'react'
import { Image, Pane } from 'evergreen-ui'

const imageSizeRegex = /_33B2BF251EFD_([0-9]+x|x[0-9]+|[0-9]+x[0-9]+)$/

export default ({ src, ...props }) => {
  const match = imageSizeRegex.exec(src)

  if (!match) {
    return (
      <Pane
        is="span"
        position="relative"
        maxWidth="100%"
        width="100%"
      >
        <Image
          marginY={18}
          width="auto"
          maxWidth="100%"
          src={src}
          height="auto"
          border="0"
          msinterpolationmode="bicubic"
          {...props}
        />
      </Pane>

    )
  }

  const [width, height] = match[1].split('x').map(s => (s === '' ? undefined : Number(s)))
  return (
    <Pane
      is="span"
      position="relative"
      maxWidth="100%"
    >
      <Image
        marginY={18}
        maxWidth="100%"
        width={width}
        height={height}
        border="0"
        msinterpolationmode="bicubic"
        src={src.replace(imageSizeRegex, '')}
        {...props}
      />
    </Pane>
  )
}
