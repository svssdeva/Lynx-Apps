import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import {PokemonCard} from "./components/PokemonCard.js";

export function App() {


  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])

  const onTap = useCallback(() => {
    'background only'

  }, []);

  return (
      <>
        <view>
          <text>Hello Lynx Pokedex</text>
        </view>
        <scroll-view className="container">
            <PokemonCard></PokemonCard>
        </scroll-view>
      </>
  )
}
