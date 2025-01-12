'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import FlickityCarousel from "@/components/FlickityCarousel";

export default function Page() {
    const [tmdb_id, setTmdbId] = useState<string>('');

    // Flickity options
    const flickityOptions = {
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        autoPlay: true,
        lazyLoad: true,
        imagesLoaded: true,
    };

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
                <Image
                    src={`/images/posters/tmdb/${tmdb_id}/w600_and_h900_bestv2.jpg`}
                    alt="movie poster"
                    width={440}
                    height={660}
                    priority={true}
                />
            ) : (
                <p>Loading...</p> // Fallback while ID is being fetched
            )}

            {/* Flickity Carousel */}
            <FlickityCarousel options={flickityOptions}>
                {/* Example Children for the Carousel */}
                <div className="carousel-cell" style={{width: '300px', height: '200px', background: 'red'}}>
                    Slide 1
                </div>
                <div className="carousel-cell" style={{width: '300px', height: '200px', background: 'blue'}}>
                    Slide 2
                </div>
                <div className="carousel-cell" style={{width: '300px', height: '200px', background: 'green'}}>
                    Slide 3
                </div>
            </FlickityCarousel>
        </>
    );
}

// If you encounter issues with server-side rendering (e.g., window is not defined), you can use Next.js's dynamic import feature with ssr: false.
// import dynamic from 'next/dynamic';
// const FlickityCarousel = dynamic(() => import('../components/FlickityCarousel'), {ssr: false,});
