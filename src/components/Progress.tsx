import { css } from 'styled-system/css'

export default function Progress() {
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
          bgColor: 'progress.fulfilled',
          width: '95%',
          height: '20%',
          borderRadius: 'full',
        })}
      />
    </div>
  )
}
