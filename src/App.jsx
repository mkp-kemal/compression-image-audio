import './app.css'
import AudioCompressor from './components/AudioCompressor'
import CompressImage from './components/CompressImage'


function App() {

  return (
    <div className="App">
      <div style={{marginBottom: '20px'}}>
        <AudioCompressor />
      </div>
      <CompressImage />
    </div>
  )
}

export default App
