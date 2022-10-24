import '../styles/color-palette.css'
import { useAppDispatch } from '../hooks'
import { setColor } from '../reducers/color'

function ColorPalette() {
  const dispatch = useAppDispatch()
  const hexList = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff'
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
