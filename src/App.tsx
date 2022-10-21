import Canvas from './components/Canvas'

function App() {
  return (
    <div className="pixel-painter">
      <Canvas
        canvasColumnCount={21}
        canvasRowCount={21}
        canvasCellWidth={14}
        canvasCellHeight={14}
      />
    </div>
  )
}

export default App
