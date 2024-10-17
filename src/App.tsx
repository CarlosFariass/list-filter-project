import './App.css'
import { TaskProvider} from './contexts/taskContext'
import List from './components/list/list'

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
