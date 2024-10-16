// import { useState } from 'react'
import './App.css'
import { TaskProvider} from './context/taskContext'
import List from './components/list'

function App() {

  return (
    <>
     <TaskProvider>
        <div className="rounded-[30px] w-[1000px] border border-gray-300">
          <List />
        </div>
    </TaskProvider>
    </>
  )
}

export default App
