import React, { useState, useEffect } from 'react'

const MousePos = () => {
    const [mousePos, setMousePos] = useState({
        x: 0, y: 0,
    })

    useEffect(()=>{
        const elem = document.getElementById('rt-mousepos')
        elem.addEventListener('glmousemove', (e: CustomEvent) => {
            setMousePos({
                x: e.detail.pos.x,
                y: e.detail.pos.y
            })
        })
    },[])

    return (
        <div id="rt-mousepos">
            <p>Mouse X: {mousePos.x}</p>
            <p>Mouse Y: {mousePos.y}</p>
            {/* <div className="slidercontainer">
                <input type="range" min="-180" max="180" className="slider"
                    id="rot_slider1"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 0
                            }
                        }))
                    }}
                />
            </div>
            <div className="slidercontainer">
                <input type="range" min="-180" max="180" className="slider"
                    id="rot_slider2"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 1
                            }
                        }))
                    }}
                />
            </div>
            <div className="slidercontainer">
                <input type="range" min="-180" max="180" className="slider"
                    id="rot_slider3"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 2
                            }
                        }))
                    }}
                />
            </div>
            <div className="slidercontainer">
                <input type="range" min="-180" max="180" className="slider"
                    id="rot_slider4"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 3
                            }
                        }))
                    }}
                />
            </div> */}
            <div className="slidercontainer">
                <input type="range" min="-180" max="180" className="slider"
                    id="rot_slider_balok"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 4
                            }
                        }))
                    }}
                />
            </div>
            <div className="slidercontainer">
                <input type="range" min="0" max="180" className="slider"
                    id="rot_slider_balok"
                    onChange={(e) => {
                        console.log('Slider event')
                        const elem = document.getElementById('canvas')
                        elem.dispatchEvent(new CustomEvent('ui-rotate', {
                            detail: {
                                rot: e.target.value,
                                id: 5
                            }
                        }))
                    }}
                />
            </div>
        </div>
    )
}

export default MousePos
