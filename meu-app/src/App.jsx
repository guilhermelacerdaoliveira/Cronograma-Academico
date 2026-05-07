import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div>
      <h1>Lição de PW</h1>
      <p>apredendo a usar o vite</p>
      <br></br>
      <img 
        src={viteLogo} 
        alt="Logo do Vite" 
        width="150"
      />
    </div>
  )
}

export default App