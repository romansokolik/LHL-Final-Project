'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import FlickityCarousel from "@/components/FlickityCarousel";
import Link from "next/link";
// import axios from "axios";
import {fetch_recommender_data} from "@/utils/api";

type Slide = {
    tmdb_id: number;
    title: string;
    rating: number;
    genre: string;
    original_title: string;
    score: number;
};

export default function Page() {
    const [tmdb_id, setTmdbId] = useState<string>('');
    const [matchedPostersData, setMatchedPostersData] = useState(null);
    // const [comparePosterData, setComparePosterData] = useState(null);
    const [posterSearchesData, setPosterSearchesData] = useState(null);
    const [contentsBasedData, setContentsBasedData] = useState(null);
    // console.log('getData.slides', Object(carouselData).slides);

    // Flickity options
    const flickityOptions = {}
    const intervalTime = 5000; // Interval time in milliseconds (5 seconds)
    function startFetchingData(id:string) {
        // return null;
        return setInterval(async () => {
            try {
                const data = await fetch_recommender_data('poster-searches', String(id));
                console.log('poster-searches - data:', data.scores, typeof data.scores);
                setPosterSearchesData(data.scores);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }, intervalTime);
        // return fetchDataLoop; // Return interval ID to stop it later if needed
    }


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
                // console.log('contents-based - data:', data);
                setContentsBasedData(data.results);
            })();
            (async () => {
                const data = await fetch_recommender_data('matched-posters', id);
                // console.log('matched-posters - data:', data.posters, typeof data.posters);
                setMatchedPostersData(data.posters);
            })();
            (async () => {
                const data = await fetch_recommender_data('compare-poster', id);
                console.log('compare-poster - data:', data.scores, typeof data.scores);
                // setComparePosterData(data.scores);
            })();
            // Start fetching data
            const intervalId = startFetchingData(id);
            const minutes = 30 * 60000;
            // Example: Stopping it after 30 seconds
            setTimeout(() => {
                clearInterval(intervalId);
                console.log('Stopped fetching data');
            }, minutes); // Stops after 10 minutes
        });
    }, []);

    return (
        <>
            <h1 className="text-center">Recommender - Movie Page</h1>
            <div className={'container text-center'}>
                <div className={'row row-cols-auto'}>
                    <div className={'col p-1 m-0'}>
                        {tmdb_id ? (
                            <Image
                                src={`/images/posters/tmdb/${tmdb_id}/w600_and_h900_bestv2.jpg`}
                                alt="movie poster" width={300} height={450} priority={true}/>
                        ) : (
                            <p>Loading...</p> // Fallback while ID is being fetched
                        )}
                    </div>
                    <div className={'col overflow-scroll px-0'} style={{width: '19.5rem', height: '28rem'}}>
                        <div>Matched</div>
                        {matchedPostersData && Object(matchedPostersData).map((slide: Slide, i: number) => (
                            <Link key={i} className={'m-0 p-0'} href={'/recommenders/[movie]'} as={`/recommenders/${slide.tmdb_id}`}>
                                <Image key={i} src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                       alt={String(slide.score)} title={String(slide.score)} width={88}
                                       height={132} priority={false} className={'m-1'}/>
                            </Link>
                        ))}
                    </div>
{/*                    <div className={'col overflow-scroll pe-3'} style={{width: '8rem', height: '28rem'}}>
                        <span>Searched</span>
                        {comparePosterData && Object(comparePosterData).map((slide: Slide, i: number) => (
                            <Link href={'/recommenders/[movie]'} as={`/recommenders/${slide.tmdb_id}`} key={i}>
                                <Image key={i} src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                       alt={String(slide.score)} title={String(slide.score)} width={96}
                                       height={132} priority={false} className={'my-1'}/>
                            </Link>
                        ))}
                    </div>*/}
                    <div className={'col overflow-scroll px-0'} style={{width: '19.5rem', height: '28rem'}}>
                        <div>Searching</div>
                        {posterSearchesData && Object(posterSearchesData).map((slide: Slide, i: number) => (
                            <Link className={'m-0 p-0'} href={'/recommenders/[movie]'} as={`/recommenders/${slide.tmdb_id}`} key={i}>
                                <Image key={i} src={`/images/posters/tmdb/${slide.tmdb_id}/w220_and_h330_face.jpg`}
                                       alt={String(slide.score)} title={String(slide.score)} width={88}
                                       height={132} priority={false} className={'m-1'}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flickity Carousel */}
            <FlickityCarousel options={flickityOptions}>
                {/* Example Children for the Carousel */}
                {contentsBasedData && Object(contentsBasedData).map((slide: Slide, i: number) => (
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