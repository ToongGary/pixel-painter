import '../styles/color-palette.css'
import { useAppDispatch } from '../hooks'
import { setColor } from '../reducers/color'

function ColorPalette() {
  const dispatch = useAppDispatch()
  const hexList = [
    '#212f3d',
    '#283747',
    '#616a6b',
    '#717d7e',
    '#909497',
    '#b3b6b7',
    '#a04000',
    '#af601a',
    '#b9770e',
    '#b7950b',
    '#239b56',
    '#1e8449',
    '#117a65',
    '#148f77',
    '#2874a6',
    '#1f618d',
    '#6c3483',
    '#76448a',
    '#b03a2e',
    '#922b21'
  ]

  const colors = hexList.map((hex) => {
    return (
      <div
        key={hex}
        data-color={hex}
        style={{ backgroundColor: hex }}
        onClick={setCurrentColor}
      ></div>
    )
  })

  return <div className={'color-palette'}>{colors}</div>

  function setCurrentColor(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = event.target as HTMLDivElement
    const color = target.dataset.color as string
    dispatch(setColor(color))
  }
}

export default ColorPalette
