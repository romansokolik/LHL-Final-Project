'use client';

// import Image from "next/image";
// import styles from "./page.module.styles";
import {useEffect, useState} from "react";
import {fetch_home_items, fetch_get_data, fetch_post_data} from '@/utils/api';

export default function Home() {
    const [items, setItems] = useState([]);
    const [getData, setGetData] = useState(null);
    const [postData, setPostData] = useState(null);

    const handle_get_request = async () => {
        const data = await fetch_get_data();
        setGetData(data);
    };

    const handle_post_request = async () => {
        // const items = ['John',12];
        const data = await fetch_post_data('Roman');
        setPostData(data);
    };

    const fetch_and_set_items = async () => {
        try {
            await fetch_home_items().then((data) => {
                setItems(data.items);
            });
        } catch (error) {
            console.error('Error fetching items:', error);
        }
        // return items;
    };

    useEffect(() => {
        // Using an IIFE to call the async function and handle its promise
        (async () => {
            await fetch_and_set_items();
        })();
    }, []);

    return (
        <div className={'d-flex h-100 text-center'}>
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <h1>LHL - Final Project</h1>
                <p className="lead">Cover is a one-page template for building simple and beautiful home pages.
                    Download,
                    edit the text, and add your own fullscreen background photo to make it your own.</p>
                <p className="lead">
                    <a href="#" className="btn btn-lg btn-light fw-bold border-white bg-white">Learn more</a>
                </p>
            </div>
        </div>
    );
}