
import { Boxes, Layers, Rotate3d, ZoomIn } from 'lucide-react'
import Btn from './Btn'
import { setExplode } from '../animations/explode'
import { focusOn } from '../animations/camera'
import { actions } from '../controls/actions'
import { getState, useStore } from '../state/store'

export default function ExplodeBar() {
  const ex = useStore(
    (/** @type {{ exploded: boolean }} */ s) => s.exploded
  )

  const rot = useStore(
    (/** @type {{ autoRotate: boolean }} */ s) => s.autoRotate
  )

  return (
    <div className="row">
      <Btn
        label="BONGKAR"
        icon={Boxes}
        tone="violet"
        active={ex}
        onClick={() => setExplode(true)}
      />

      <Btn
        label="SUSUN KEMBALI"
        icon={Layers}
        onClick={() => setExplode(false)}
      />

      <Btn
        label="PUTAR OBJEK"
        icon={Rotate3d}
        active={rot}
        onClick={actions.rotate}
      />

      <Btn
        label="LIHAT DETAIL"
        icon={ZoomIn}
        onClick={() => {
          const selected = getState().selected
          if (selected) focusOn(selected)
        }}
      />
    </div>
  )
}
