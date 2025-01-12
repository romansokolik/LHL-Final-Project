'use client';

// import Image from "next/image";
// import styles from "./page.module.styles";
import {useEffect, useState} from "react";
import {fetchItems, fetchGetData, fetchPostData} from '@/utils/api';

export default function Home() {
    const [items, setItems] = useState([]);
    const [getData, setGetData] = useState(null);
    const [postData, setPostData] = useState(null);

    const handleGetRequest = async () => {
        const data = await fetchGetData();
        setGetData(data);
    };

    const handlePostRequest = async () => {
        // const items = ['John',12];
        const data = await fetchPostData('Roman');
        setPostData(data);
    };
    // fetch("/api/items")
    //     .then((res) => res.json())
    //     .then((data) => setItems(data.items));

    const fetchAndSetItems = async () => {
        try {
            await fetchItems().then((data) => {
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
            await fetchAndSetItems();
        })();
    }, []);

    return (
        <div>
            <div>
                <button onClick={handleGetRequest}>Fetch GET Data</button>
                {getData && <pre>{JSON.stringify(getData, null, 2)}</pre>}
                <button onClick={handlePostRequest}>Fetch POST Data</button>
                {postData && <pre>{JSON.stringify(postData, null, 2)}</pre>}
            </div>
            <h1>Items</h1>
            <ul>
                {items.map((item: { id: number, name: string, age: number }) => (
                    // <li key={i}>{item}</li>
                    <li key={item.id}>{item.name} - {item.age}</li>
                ))}
            </ul>
        </div>
    );
}
