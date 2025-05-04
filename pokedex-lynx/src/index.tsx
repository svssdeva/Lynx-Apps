import { root } from '@lynx-js/react'
import { MemoryRouter, Routes, Route } from 'react-router';
import { App } from './App.js'
import {PokemonDetailPage} from "./pages/PokemonDetail.js";

root.render(<MemoryRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/pokemon/:index" element={<PokemonDetailPage />} />
  </Routes>
</MemoryRouter>,)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
