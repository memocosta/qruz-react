import { functions, isEqual, omit } from 'lodash'
import React, { useState, useEffect, useRef } from 'react'

function Map({ options, onMount, className, onMountProps }) {
  const ref = useRef()
  const [map, setMap] = useState()

  useEffect(() => {
    const onLoad = () =>
      setMap(new window.google.maps.Map(ref.current, { ...options }))
    if (!window.google) {
      const script = document.createElement(`script`)
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=` +
        process.env.REACT_APP_MAP_KEY + `&libraries=places`
      document.head.append(script)
      script.addEventListener(`load`, onLoad)
      return () => script.removeEventListener(`load`, onLoad)
    } else onLoad()
  }, [options])

  if (map && typeof onMount === `function`) onMount(map, onMountProps)

  return (
    <div
      style={{ height: `80vh`, borderRadius: `0.5em` }}
      {...{ ref, className }}
    />
  )
}

function shouldNotUpdate(props, nextProps) {
  const [funcs, nextFuncs] = [functions(props), functions(nextProps)];
  const noPropChange = isEqual(omit(props, funcs), omit(nextProps, nextFuncs))
  const noFuncChange =
    funcs.length === nextFuncs.length &&
    funcs.every(fn => props[fn].toString() === nextProps[fn].toString())
    return noPropChange && noFuncChange
}

export default React.memo(Map, shouldNotUpdate)

Map.defaultProps = {
  options: {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  },
}