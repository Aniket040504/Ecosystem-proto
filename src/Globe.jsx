import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Simple globe view that shows the ISS position in realtime using a public API
// Polls the ISS endpoint every 5 seconds and updates a single marker on the globe.
export default function GlobeView({ className = '' }) {
  const globeRef = useRef()
  const [points, setPoints] = useState([])

  useEffect(() => {
    // enable gentle auto-rotation
    if (globeRef.current) {
      try {
        const controls = globeRef.current.controls()
        if (controls) {
          controls.autoRotate = true
          controls.autoRotateSpeed = 0.4
        }
      } catch (e) {
        // ignore if controls not available yet
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const lat = Number(data.latitude)
        const lng = Number(data.longitude)
        setPoints([{ lat, lng, size: 0.5, color: 'orange', label: `ISS (${lat.toFixed(2)}, ${lng.toFixed(2)})` }])

        // smoothly move camera a bit towards the ISS
        try {
          globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 1000)
        } catch (e) {
          // noop
        }
      } catch (err) {
        console.error('ISS fetch failed', err)
      }
    }

    fetchISS()
    const id = setInterval(fetchISS, 5000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className={`h-full w-full ${className}`}>
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={points}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointColor={(d) => d.color}
        pointRadius={(d) => d.size}
        pointLabel={(d) => d.label}
        // simple pop-up on hover
        onPointClick={(d) => alert(d.label)}
        width={400}
        height={400}
        style={{ outline: 'none' }}
      />
    </div>
  )
}
