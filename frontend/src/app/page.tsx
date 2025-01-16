'use client';

// import Image from "next/image";
// import styles from "./page.module.styles";
import {useEffect, useState} from "react";
import {fetch_home_items, fetch_get_data, fetch_post_data} from '@/utils/api';
import Image from "next/image";

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
                <Image src={'/images/Lighthouse-Labs.png'} alt={'Lighthouse Labs'} priority={false}
                       width={480} height={100} className={'image-fluid w-25 h-auto mx-auto my-3 bg-gradient'}/>
                <h1 className={'h1'}>DATA SCIENCE - FINAL PROJECT</h1>
                <Image src={'/images/Data-Science.png'} alt={'Data Science'} priority={true}
                       width={1400} height={725} className={'image-fluid w-75 h-auto mx-auto'}/>
                {/*<p className="lead">*/}
                {/*    <a href="#" className="btn btn-lg btn-light fw-bold border-white bg-white">Learn more</a>*/}
                {/*</p>*/}
            </div>
        </div>
    );
}
