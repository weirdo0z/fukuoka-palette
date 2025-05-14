import { use$ } from '@legendapp/state/react'
import { useState } from 'preact/hooks'
import { css } from 'styled-system/css'
import { globalState$ } from '~/app'

export default function Progress() {
  // Calculate progress with delay to account for state changes
  const globalState = use$(globalState$)
  const [progress, setProgress] = useState(0)
  const [unlocked, setUnlocked] = useState(0)
  const [total, setTotal] = useState(0)

  setTimeout(() => {
    const currentState = globalState
    const newTotal = Object.keys(currentState).length
    const newUnlocked = Object.values(currentState).filter(
      status => status === 'unlocked'
    ).length
    const newProgress = newTotal > 0 ? (newUnlocked / newTotal) * 100 : 0

    setTotal(newTotal)
    setUnlocked(newUnlocked)
    setProgress(newProgress)
  }, 300)

  return (
    <div
      class={css({
        height: '5%',
        width: 'calc(100% - 2rem)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
      })}
    >
      <div
        class={css({
          bgColor: 'progress.track',
          width: '95%',
          height: '20%',
          borderRadius: 'full',
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        <div
          class={css({
            bgColor: 'progress.fulfilled',
            height: '100%',
            borderRadius: 'full',
            transition: 'width 0.3s ease',
          })}
          style={{ width: `${progress}%` }}
        />
        <div
          class={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '0.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 2px rgba(0,0,0,0.5)',
          })}
        >
          {unlocked}/{total}
        </div>
      </div>
    </div>
  )
}
