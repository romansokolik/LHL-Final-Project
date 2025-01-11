'use client'

export default function HandThumb({score, rem = 1}: { score?: number, rem?: number }) {
    return (
        <i className={`bi bi-hand-thumbs-${score == 1 ? 'up' : 'down'} me-3 p-1`}
           style={{
               color: 'white',
               backgroundColor: score == 1 ? 'green' : 'red',
               borderRadius: '50%',
               fontSize: `${rem}rem`
           }}/>
    )
}