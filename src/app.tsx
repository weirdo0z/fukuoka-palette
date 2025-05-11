import { observable } from '@legendapp/state'
import { useEffect, useState } from 'preact/hooks'
import ReactConfetti from 'react-confetti'
import { useCookies } from 'react-cookie'
import { css } from 'styled-system/css'

import hfhs from '~/assets/OIP.jpg'
import Card from '~/components/Card'
import Progress from '~/components/Progress'

export const globalState$ = observable<Record<number, 'unlocked' | 'pending'>>(
  {},
)

export interface Place {
  id: number
  name: string
  coord: {
    lat: number
    lon: number
  }
  scope: number // meter(s)
  stamp: string | null
}

/*
  長浜一市
  ポートタワー
  福岡タワー
  かき小屋
  桜井二見ヶ浦
  小倉城
  平尾台の鍾乳洞
  南蔵院涅槃像
  八女茶スイーツ
  茶の文化館
  油山
  皿倉山 10億ドルの夜景
  いのちのたび博物館
  八女茶
  星野村
 */

// temp values; not accurate
const places: Place[] = [
  {
    id: 0,
    name: '長浜鮮魚市場\nNagahama Fish Market',
    coord: {
      lat: 0,
      lon: 0,
    },
    scope: 0,
    stamp: null,
  },
  {
    id: 1,
    name: '福岡ポートタワー\nFukuoka Port Tower',
    coord: {
      lat: 33.591389,
      lon: 130.385556,
    },
    scope: 500,
    stamp: null,
  },
  {
    id: 2,
    name: '福岡タワー\nFukuoka Tower',
    coord: {
      lat: 33.589722,
      lon: 130.360556,
    },
    scope: 500,
    stamp: null,
  },
  {
    id: 3,
    name: 'かき小屋\nOyster Hut',
    coord: {
      lat: 0,
      lon: 0,
    },
    scope: 100, // 一般的な範囲として
    stamp: null,
  },
  {
    id: 4,
    name: '桜井二見ヶ浦\nSakurai Futamigaura',
    coord: {
      lat: 33.583889,
      lon: 130.217222,
    },
    scope: 300,
    stamp: null,
  },
  {
    id: 5,
    name: '小倉城\nKokura Castle',
    coord: {
      lat: 33.880278,
      lon: 130.876111,
    },
    scope: 400,
    stamp: null,
  },
  {
    id: 6,
    name: '平尾台の鍾乳洞\nHiraodai Caves',
    coord: {
      lat: 33.833333,
      lon: 130.8,
    },
    scope: 1000, // 平尾台全体の広がりとして
    stamp: null,
  },
  {
    id: 7,
    name: '南蔵院涅槃像\nNanzoin Reclining Buddha',
    coord: {
      lat: 33.640278,
      lon: 130.541667,
    },
    scope: 300,
    stamp: null,
  },
  {
    id: 8,
    name: '八女茶スイーツ\nYame Tea Sweets',
    coord: {
      lat: 0,
      lon: 0,
    },
    scope: 50, // 個々の店舗の範囲として
    stamp: null,
  },
  {
    id: 9,
    name: '茶の文化館\nTea Museum',
    coord: {
      lat: 33.228056,
      lon: 130.688889,
    },
    scope: 200,
    stamp: null,
  },
  {
    id: 10,
    name: '油山\nAburayama',
    coord: {
      lat: 33.558333,
      lon: 130.433333,
    },
    scope: 2000, // 山全体の広がりとして
    stamp: null,
  },
  {
    id: 11,
    name: '皿倉山\nSarakurayama',
    coord: {
      lat: 33.861111,
      lon: 130.833333,
    },
    scope: 1500, // 山全体の広がりとして
    stamp: null,
  },
  {
    id: 12,
    name: 'いのちのたび博物館\nKMNH',
    coord: {
      lat: 33.883333,
      lon: 130.795833,
    },
    scope: 300,
    stamp: null,
  },
  {
    id: 13,
    name: '八女茶\nYame Tea',
    coord: {
      lat: 0,
      lon: 0,
    },
    scope: 5000, // 八女市全体の茶畑の広がりとして
    stamp: null,
  },
  {
    id: 14,
    name: '星野村\nHoshino Village',
    coord: {
      lat: 33.341667,
      lon: 130.716667,
    },
    scope: 10000, // 村全体の広がりとして
    stamp: null,
  },
  {
    id: 15,
    name: 'DEV:東福高\nDEV:HFHS',
    coord: {
      lat: 33.5943486,
      lon: 130.430943,
    },
    scope: 500,
    stamp: hfhs,
  },
]

export default function App() {
  const [selectedCard, setSelectedCard] = useState(-1)
  const [cookies, setCookies] = useCookies()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    globalState$.set(cookies.globalState)
  }, [cookies])

  useEffect(() => {
    // memorize what we were doing
    const beforeUnloadHandler = () => {
      setCookies('globalState', globalState$.peek() || {})
    }

    window.addEventListener('beforeunload', beforeUnloadHandler)

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [setCookies])

  useEffect(() => {
    const isUserinScope = (
      placeCoord: { lat: number; lon: number },
      userCoord: { lat: number; lon: number },
      scope: number,
    ) => {
      if (!placeCoord.lat || !placeCoord.lon || !scope) return false

      // Haversine formula to calculate distance between two coordinates
      const R = 6371000 // Earth radius in meters
      const φ1 = (placeCoord.lat * Math.PI) / 180
      const φ2 = (userCoord.lat * Math.PI) / 180
      const Δφ = ((userCoord.lat - placeCoord.lat) * Math.PI) / 180
      const Δλ = ((userCoord.lon - placeCoord.lon) * Math.PI) / 180

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      return distance <= scope
    }

    const checkPosition = () => {
      if (!navigator.geolocation)
        alert(
          "We're sorry. Geolocation is not supported by your browser so you can't use this service.",
        )

      navigator.geolocation.getCurrentPosition(
        (position) => {
          for (const place of places) {
            if (
              isUserinScope(
                place.coord,
                {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                },
                place.scope,
              ) &&
              globalState$[place.id].peek() === undefined
            ) {
              globalState$[place.id].set('pending')
            }
          }
        },
        (error) => {
          console.error(error)
          alert(
            error.PERMISSION_DENIED
              ? "We're sorry. But you can't use this service unless you permit us to use your location.\nThe data must be processed on your device, and will not be sent to our server."
              : error.POSITION_UNAVAILABLE
                ? 'Your position might be unavailable. Please try again.'
                : error.TIMEOUT
                  ? 'Our service is timeouted while trying to get your position. Please try again.'
                  : error.message,
          )
        },
      )
    }

    const positionUpdateInterval = setInterval(() => checkPosition(), 60000)

    checkPosition()

    return () => clearInterval(positionUpdateInterval)
  }, [])

  return (
    <div
      class={css({
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        width: '100dvw',
        backgroundColor: 'bg.normal',
        padding: '1rem',
      })}
    >
      {showConfetti ? (
        <div
          class={css({
            position: 'fixed',
            zIndex: 150,
            width: '100dvw',
            height: '100dvh',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          })}
        >
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={100}
            recycle={false}
            opacity={0.8}
            gravity={0.3}
            initialVelocityY={30}
            confettiSource={{
              x: window.innerWidth / 2,
              y: window.innerHeight,
              w: 0,
              h: 0,
            }}
            tweenDuration={3000}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        </div>
      ) : (
        <></>
      )}
      {selectedCard !== -1 ? (
        <div
          class={css({
            width: '100dvw',
            height: '100dvh',
            position: 'absolute',
            top: 0,
            left: 0,
            bgColor: '#00000033',
            zIndex: 50,
          })}
          onClick={() => setSelectedCard(-1)}
          onKeyPress={() => setSelectedCard(-1)}
        />
      ) : (
        <></>
      )}

      {/* App Header */}
      <header
        class={css({
          marginBottom: '1rem',
          width: 'fit-content',
          padding: '0.5rem 1rem 0.5rem 1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          bgColor: 'bg.dent',
          boxShadow: `
            inset 2px 2px 3px rgba(0, 0, 0, 0.1),
            inset -2px -2px 3px rgba(255, 255, 255, 0.5)
          `,
        })}
      >
        <h1 class={css({ fontSize: '1.75rem' })}>Fukuoka Palette</h1>
      </header>

      {/* Main Content Area */}
      <main
        class={css({ height: '93%', position: 'relative', overflow: 'hidden' })}
      >
        <div
          class={css({
            height: '100%',
            width: '98%',
            top: '-2.5%',
            position: 'absolute',
            pointerEvents: 'none',
            background:
              'linear-gradient(to top, var(--colors-bg-normal) 2.5%, #00000000 5%, #00000000 95%, var(--colors-bg-normal) 97.5%)', // 上に向かって透明になるグラデーション
          })}
        />
        <div
          class={css({
            height: '95%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            overflowY: 'auto',
            paddingTop: '5%',
          })}
        >
          {places.map((place) => (
            <Card
              key={place.id}
              place={place}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              setShowConfetti={setShowConfetti}
            />
          ))}
        </div>
        <Progress />
      </main>
    </div>
  )
}
