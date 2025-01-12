'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';

export default function Page() {
    const [tmdb_id, setTmdbId] = useState('');

    useEffect(() => {
        // Safely access the window object in the client
        const pathname = window.location.pathname;
        const id = pathname.split('/').reverse()[0];
        setTmdbId(id); // Update the state with the extracted ID
    }, []);

    return (
        <>
            <h1 className="text-center">Recommender - Movie Page</h1>
            {tmdb_id ? (
                <Image src={`/images/posters/tmdb/${tmdb_id}/w600_and_h900_bestv2.jpg`}
                       alt="movie poster" width={440} height={660} priority={true}/>
            ) : (
                <p>Loading...</p> // Fallback while ID is being fetched
            )}
        </>
    );
}
