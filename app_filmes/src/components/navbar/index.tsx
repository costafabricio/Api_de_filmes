"use client"

import { useState } from 'react'

import './index.scss'
import { BsSearch } from 'react-icons/bs'

export default function Navbar() {
    const [input, setInput] = useState("")

    function onResearch(e: FormEvent) {
        e.preventDefault()

        if(input === '') return

       navigate(`/detail/${input}`)
    }

    return(
        <nav className="navbar">
            <h1 className="page-title">Filmes</h1>

            <div>
             <form onSubmit={onResearch} className='form'>
              <input 
              type="text" 
              placeholder='Pesquisar' 
              className='research'
              value={input}
              onChange={(e) => setInput(e.target.value)} 
              />
               <button type='submit' className='button'>
                  <BsSearch size={30} color="#fff"/>
               </button>
             </form>
            </div>

        </nav>
    )
}