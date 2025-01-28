'use server'

import PostersFrame from "@/components/PostersFrame";
import Image from "next/image";
import {fetch_recommender_data} from "@/utils/api";
import Link from "next/link";
import FlickityCarousel from "@/components/FlickityCarousel";
import PostersFrameSearching from "@/components/PostersFrameSearching";

type Movie = {
    id: number;
    title: string;
    rating: number;
    genre: string;
    original_title: string;
    score: number;
};

export default async function Page({params}: { params: { movie: number } }) {

    const id: number = await params.movie;
    const matchedData = await fetch_recommender_data('matched-posters', id);
    const contentBasedData = await fetch_recommender_data('contents-based', id);
    const searchedData = await fetch_recommender_data('poster-searches', id);

    const flickityOptions = {};
    console.log('id:', id);
    console.log('matchedData:', matchedData);

    return (
        <>
            <div className={'container text-center'}>
                <div className={'row row-cols-auto'}>
                    <div id={'movie-poster'} className={'col p-1 m-0'}>
                        {id ? (
                            <Image
                                src={`/images/posters/tmdb/${id}/w600_and_h900_bestv2.jpg`}
                                alt="movie poster" width={300} height={450} priority={true}/>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className={'col overflow-scroll px-0'} style={{width: '19.5rem', height: '28rem'}}>
                        <div>Matched</div>
                        <PostersFrame data={matchedData.posters || []}/>
                    </div>
                    <div className={'col overflow-scroll px-0'} style={{width: '19.5rem', height: '28rem'}}>
                        <div>Searching</div>
                        {/*<PostersFrame data={searchedData.scores || []}/>*/}
                        <PostersFrameSearching id={id} data={searchedData.scores || []}/>
                    </div>
                </div>
                <FlickityCarousel options={flickityOptions}>
                    {contentBasedData.results && contentBasedData.results.map((movie: Movie, i: number) => (
                        <div key={i} className="carousel-cell">
                            <Link href={'/recommenders/[movie]'} as={`/recommenders/${movie.id}`}>
                                <Image src={`/images/posters/tmdb/${movie.id}/w220_and_h330_face.jpg`}
                                       alt={String(movie.title)} title={String(movie.title)} width={88} height={132}
                                       priority={false}
                                       className={'m-0 border border-1 p-1'}/>
                            </Link>
                        </div>
                    ))}
                </FlickityCarousel>
            </div>
        </>
    );
}
