import React from 'react'

import { CardLayout, GU, useLayout } from '@aragon/ui'

const TaskCardGroup = ({
  columnWidthMin = 34 * GU,
  rowHeight = 530,
  children,
}) => {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'

  return (
    <section>
      <CardLayout
        columnWidthMin={columnWidthMin}
        rowHeight={compactMode ? null : rowHeight}
      >
        {children}
      </CardLayout>
    </section>
  )
}

export default TaskCardGroup
