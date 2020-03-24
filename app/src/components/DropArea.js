import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useDrop } from 'react-dnd'

import { IconArrowDown } from '@aragon/ui'

import { ItemTypes } from '../lib/dnd-utils'

const INITIAL_HEIGHT = '70px'

const DropArea = React.forwardRef(({ children, isEmpty }, _) => {
  const [{ canDrop }, drop] = useDrop({
    accept: ItemTypes.TASK,
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
    }),
  })
  return (
    <MainDropArea ref={drop} canDrop={canDrop} isEmpty={isEmpty}>
      {canDrop && (
        <DropPreviewArea>
          <FloatingArrowDown size="large" color="black" />
        </DropPreviewArea>
      )}
      {isEmpty && canDrop ? null : children}
    </MainDropArea>
  )
})

const float = keyframes`
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-15px);
  }
  100% {
    transform: translatey(0px);
  }
`
const MainDropArea = styled.div`
  position: relative;
  ${({ isEmpty }) =>
    isEmpty ? `height: ${INITIAL_HEIGHT};` : `transition: opacity 0.5s;`}

  ${({ canDrop }) => canDrop && `border: 2px dashed grey; opacity: 0.5;`}
  margin-bottom: 3%;
`

const DropPreviewArea = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const FloatingArrowDown = styled(IconArrowDown)`
  height: 50px;
  width: 50px;
  z-index: 1;
  animation: ${float} 2.5s ease-in-out infinite;
`
export default DropArea
