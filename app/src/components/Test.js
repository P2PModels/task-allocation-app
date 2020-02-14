import React, { useState } from 'react'

const Test = ({ a }) => {
  const [s, setS] = useState('inicial')
  console.log('Se ha renderizado')

  return (
    <div>
      <p>Prop a: {a}</p>
      <p>State s: {s}</p>
      <button
        onClick={() => {
          setS('inicial')
        }}
      >
        Change state
      </button>
    </div>
  )
}

export default React.memo(Test)
