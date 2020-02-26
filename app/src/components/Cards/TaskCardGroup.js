import React from 'react'

import { CardLayout, GU, useLayout } from '@aragon/ui'

const TaskCardGroup = ({ children }) => {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const rowHeight = compactMode ? null : 294

  return (
    <section>
      <CardLayout columnWidthMin={30 * GU} rowHeight={rowHeight}>
        {children}
      </CardLayout>
    </section>
  )
}

export default TaskCardGroup
