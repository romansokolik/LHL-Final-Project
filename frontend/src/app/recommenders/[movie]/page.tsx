'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import FlickityCarousel from "@/components/FlickityCarousel";
import Link from "next/link";
// import axios from "axios";
import {fetch_carousel_data} from "@/utils/api";

type Slide = {
    tmdb_id: number;
    title: string;
    rating: number;
    genre: string;
};

export default function Page() {
    const [tmdb_id, setTmdbId] = useState<string>('');
    const [getData, setGetData] = useState(null);

    const handle_get_request = async () => {
        const data = await fetch_carousel_data();
        setGetData(data);
    };

    console.log('getData.slides', Object(getData).slides);

    // Flickity options
    const flickityOptions = {
        cellAlign: 'left',
        contain: true,
        wrapAround: true,
        autoPlay: true,
        lazyLoad: true,
        imagesLoaded: true,
        pageDots: false,
    };


    useEffect(() => {
        // Safely access the window object in the client
        const pathname = window.location.pathname;
        const id = pathname.split('/').reverse()[0];
        setTmdbId(id); // Update the state with the extracted ID
        const fetchData = async () => {
            await handle_get_request();
        };
        fetchData();
    }, []);

    return (
        <>
            <h1 className="text-center">Recommender - Movie Page</h1>
            {tmdb_id ? (
                <Image
                    src={`/images/posters/tmdb/${tmdb_id}/w600_and_h900_bestv2.jpg`}
                    alt="movie poster" width={300} height={450} priority={true}/>
            ) : (
                <p>Loading...</p> // Fallback while ID is being fetched
            )}

            {/* Flickity Carousel */}
            <FlickityCarousel options={flickityOptions}>
                {/* Example Children for the Carousel */}
                {Object(getData).slides && Object(getData).slides.map((slide: Slide, i: number) => (
                    <div key={i} className="carousel-cell">
                        <Link href={'/recommenders/[movie]'} as={`/recommenders/${slide.tmdb_id}`}>
                            <Image src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                   alt={String(slide.rating)} title={String(slide.rating)} width={88} height={132}
                                   priority={false}
                                   className={'m-0 border border-5'}/>
                        </Link>
                    </div>
                ))}
            </FlickityCarousel>
        </>
    );
}

// If you encounter issues with server-side rendering (e.g., window is not defined), you can use Next.js's dynamic import feature with ssr: false.
// import dynamic from 'next/dynamic';
// const FlickityCarousel = dynamic(() => import('../components/FlickityCarousel'), {ssr: false,});
