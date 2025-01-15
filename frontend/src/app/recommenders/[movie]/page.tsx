'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import FlickityCarousel from "@/components/FlickityCarousel";
import Link from "next/link";
// import axios from "axios";
import {fetch_carousel_data, fetch_recommender_data} from "@/utils/api";

type Slide = {
    tmdb_id: number;
    title: string;
    rating: number;
    genre: string;
};

export default function Page() {
    const [tmdb_id, setTmdbId] = useState<string>('');
    const [carouselData, secCarouselData] = useState(null);
    const [contentsBasedData, setContentsBasedData] = useState(null);
    // console.log('getData.slides', Object(carouselData).slides);

    // Flickity options
    const flickityOptions = {}


    useEffect(() => {
        // Safely access the window object in the client
        (async () => {
            const id = window.location.pathname.split('/').reverse()[0];
            setTmdbId(id); // Update the state with the extracted ID
            return id;
        })().then((id) => {
            // Using an IIFE to call the async function and handle its promise
            (async () => {
                const data = await fetch_recommender_data('contents-based', id);
                console.log('contents-based - data:', data);
                setContentsBasedData(data.results);
            })();
            (async () => {
                const data = await fetch_carousel_data();
                secCarouselData(data.slides);
            })();

        });
    }, []);

    return (
        <>
            {/*{carouselData && console.log('carouselData:', carouselData)}*/}
            {contentsBasedData && console.log('contentsBasedData:', contentsBasedData)}
            <h1 className="text-center">Recommender - Movie Page</h1>
            <div className={'container text-center'}>
                <div className={'row row-cols-auto'}>
                    <div className={'col'}>
                        {tmdb_id ? (
                            <Image
                                src={`/images/posters/tmdb/${tmdb_id}/w600_and_h900_bestv2.jpg`}
                                alt="movie poster" width={300} height={450} priority={true}/>
                        ) : (
                            <p>Loading...</p> // Fallback while ID is being fetched
                        )}
                    </div>
                    <div className={'col overflow-scroll'} style={{width: '6rem', height: '28rem'}}>
                        <span>Content</span>
                        {contentsBasedData && Object(contentsBasedData).map((slide: {
                            tmdb_id: number,
                            original_title: string
                        }, i: number) => (
                            <Image key={i} src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                   alt={String(slide.original_title)} title={String(slide.original_title)} width={96}
                                   height={132} priority={false} className={'my-1'}/>
                            // <p key={i}>{slide.tmdb_id}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flickity Carousel */}
            <FlickityCarousel options={flickityOptions}>
                {/* Example Children for the Carousel */}
                {contentsBasedData && Object(contentsBasedData).map((slide: {
                            tmdb_id: number,
                            original_title: string,
                            title: string
                        }, i: number) => (
                    <div key={i} className="carousel-cell">
                        <Link href={'/recommenders/[movie]'} as={`/recommenders/${slide.tmdb_id}`}>
                            <Image src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                   alt={String(slide.title)} title={String(slide.title)} width={88} height={132}
                                   priority={false}
                                   className={'m-0 border border-1 p-1'}/>
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