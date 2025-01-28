'use client';

import PostersFrame from "@/components/PostersFrame";
import {useEffect, useState} from "react";
import exec_recommender_search, {fetch_recommender_data} from "@/utils/api";

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
    const [isLoading, setIsLoading] = useState(true);
    const intervalTime = 1000; // Fetching interval (1 second)
    const [stopAfter, setStopAfter] = useState(30000); // Stop after 30 seconds

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        // const fetchData = async () => {
        try {
            console.log('Running compare-poster recommender...');
            exec_recommender_search(id)
                .then(response => {
                    console.log('response:', response);
                    setIsLoading(false);
                    setStopAfter(0);
                    clearInterval(intervalId);
                });
            console.log('compare-poster recommender executed.');

            // Start polling for poster searches
            intervalId = setInterval(async () => {
                try {
                    const data = await fetch_recommender_data('poster-searches', id);
                    setPosterSearchesData(data.scores || []);
                } catch (error) {
                    console.error('Error fetching poster searches:', error);
                }
            }, intervalTime);

            // Stop polling after `stopAfter` milliseconds
            setTimeout(() => {
                clearInterval(intervalId);
                setIsLoading(false);
                console.log('Stopped fetching data');
            }, stopAfter);
        } catch (error) {
            console.error('Error in compare-poster:', error);
            setIsLoading(false);
        }
        // };

        // fetchData();

        // Cleanup function to clear interval if component unmounts
        return () => clearInterval(intervalId);
    }, [id, stopAfter]);

    return (
        <>
            {isLoading && (
                <div className="text-center" style={{position: 'sticky', top: '50%', height: 0}}>
                    <div className="spinner-border text-secondary" role="status"
                         style={{width: '7rem', height: '7rem', borderWidth: '.5rem', opacity: 0.5}}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <PostersFrame data={searchesData}/>
        </>
    );
}
