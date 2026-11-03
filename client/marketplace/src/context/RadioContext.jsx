import { createContext, useContext, useEffect, useRef, useSyncExternalStore } from 'react'
import { useSelector } from 'react-redux'
import { selectVinyls } from '../Redux/slices/catalogSlice'
import { getAudioPreview } from '../services/vinylService'
import { hasPreview, RadioEngine } from '../components/audio/radioEngine'

const RadioContext = createContext(null)
export const useRadio = () => useContext(RadioContext)
export { hasPreview }

export function RadioProvider({ children }) {
  const catalog = useSelector(selectVinyls)
  const ref = useRef(null)
  if (!ref.current) ref.current = new RadioEngine({ getPreview: getAudioPreview })
  const engine = ref.current
  engine.catalog = catalog
  const state = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot)
  useEffect(() => () => engine.close(), [engine])
  return <RadioContext.Provider value={{ ...state, playVinyl: engine.playVinyl, toggle: engine.toggle, step: engine.step, seek: engine.seek, changeVolume: engine.changeVolume, setMinimized: engine.setMinimized, close: engine.close, queue: catalog.filter(hasPreview) }}>{children}</RadioContext.Provider>
}
