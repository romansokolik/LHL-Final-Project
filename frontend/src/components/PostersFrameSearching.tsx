'use client';

import PostersFrame from "@/components/PostersFrame";
import {useEffect, useState} from "react";
import {fetch_recommender_data} from "@/utils/api";

type Movie = {
    id: number;
    title: string;
    rating: number;
    genre: string;
    original_title: string;
    score: number;
};

export default function PostersFrameSearching({id, data}: { data: Movie[], id: number }) {
    const [searchesData, setPosterSearchesData] = useState<Movie[]>(data);
    const intervalTime = 1000; // Interval time in milliseconds
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
            const fetchData = async () => {
                try {
                    // Run compare-poster recommender
                    fetch_recommender_data('compare-poster', id);
                    // Start fetching data at intervals
                    const intervalId = setInterval(async () => {
                        try {
                            const data = await fetch_recommender_data('poster-searches', id);
                            setPosterSearchesData(data.scores || []);
                        } catch (error) {
                            console.error('Error fetching poster searches:', error);
                        }
                    }, intervalTime);
                    // Stop interval after 15 seconds
                    setTimeout(() => {
                        clearInterval(intervalId);
                        setIsLoading(false);
                        console.log('Stopped fetching data');
                    }, 15000);
                    // Cleanup function to clear interval if component unmounts
                    return () => clearInterval(intervalId);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, [id]
    );
    return (
        <>
            {isLoading && (
                <div className="text-center" style={{position: 'sticky', top: '50%', height: 0}}>
                    <div className="spinner-border text-secondary" role="status"
                         style={{width: '7rem', height: '7rem', borderWidth: '.5rem', opacity: .5}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <PostersFrame data={searchesData}/>
        </>
    );
}