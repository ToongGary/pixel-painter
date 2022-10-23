import { useAppDispatch } from '../hooks'
import { setClear } from '../reducers/canvas'

function Reset() {
  const dispatch = useAppDispatch()

  const clearCanvas = () => {
    dispatch(setClear(true))
  }

  return <button onClick={clearCanvas}>Reset</button>
}

export default Reset
