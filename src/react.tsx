import React from 'react'
import ReactDOM from 'react-dom'

import MousePos from './components/MousePos'
import DrawButtons from './components/DrawButtons'

const App: React.FC = () => {
    return (
        <>
            <div>Hello, AM-kel13!</div>
            <MousePos />
            {/* <DrawButtons /> */}
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))