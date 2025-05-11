import { use$ } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'framer-motion'
import { css } from 'styled-system/css'

import { type Place, globalState$ } from '~/app'

export default function Card({
  place,
  selectedCard,
  setSelectedCard,
  setShowConfetti
}: {
  place: Place
  selectedCard: number
  setSelectedCard: (id: number) => void
  setShowConfetti: (bool: boolean) => void
}) {
  const state = use$(globalState$[place.id])

  const completeHandler = () => {
    setShowConfetti(true)
    globalState$[place.id].set('unlocked')
  }

  return (
    <>
      <motion.div
        layoutId={`card-${place.id}`}
        class={css({
          width: 'calc(50% - 0.5rem)',
          height: '30%',
          borderRadius: '1rem',
          bgColor: 'bg.dent',
          boxShadow: `
            inset 2px 2px 3px rgba(0, 0, 0, 0.1),
            inset -2px -2px 3px rgba(255, 255, 255, 0.5)
          `,
          marginBottom: '1rem',
          padding: '1rem',
          cursor: 'pointer',
          visibility: selectedCard === place.id ? 'hidden' : 'visible',
          position: 'relative',
        })}
        onClick={() => setSelectedCard(place.id)}
      >
        {state === 'pending' && (
          <div
            class={css({
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              bgColor: 'yellow.400',
              boxShadow: '0 0 5px rgba(255, 255, 0, 0.5)',
            })}
          />
        )}
        <div
          class={css({
            height: '80%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          })}
        >
          {place.img || <div class={css({ color: 'gray.400' })}>No Image</div>}
        </div>
        <div>
          {place.name.split('\n').map((name, i) => (
            <div
              key={Math.random()}
              class={css({
                fontSize: i === 1 ? '0.85rem' : '1rem',
                textAlign: 'center',
              })}
            >
              {name}
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCard === place.id ? (
          <motion.div
            layoutId={`card-${place.id}`}
            class={css({
              position: 'fixed',
              width: '80%',
              height: '60%',
              borderRadius: '1rem',
              bgColor: 'bg.dent',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              padding: '2rem',
              zIndex: 100,
            })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, top: '20%', left: '10%' }}
          >
            {state === 'pending' && (
              <div
                class={css({
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  bgColor: 'yellow.400',
                  boxShadow: '0 0 10px rgba(255, 255, 0, 0.5)',
                })}
              />
            )}
            <div
              class={css({
                height: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              })}
              onClick={() => state === 'pending' && completeHandler()}
              onKeyDown={() => state === 'pending' && completeHandler()}
            >
              {state === 'pending' ? (
                <div class={css({ color: 'gray.400', fontSize: '1.5rem' })}>
                  Tap to stamp here!
                </div>
              ) : state === 'unlocked' ? (
                <div>stamp</div>
              ) : (
                place.img || (
                  <div class={css({ color: 'gray.400', fontSize: '1.5rem' })}>
                    No Image
                  </div>
                )
              )}
            </div>
            <div>
              {place.name.split('\n').map((name, i) => (
                <div
                  key={Math.random()}
                  class={css({
                    fontSize: i === 1 ? '1.2rem' : '1.5rem',
                    textAlign: 'center',
                    marginBottom: i === 0 ? '0.5rem' : '0',
                  })}
                >
                  {name}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <></>
        )}
      </AnimatePresence>
    </>
  )
}
