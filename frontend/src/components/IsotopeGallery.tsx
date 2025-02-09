'use client';

import {useEffect, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Isotope from 'isotope-layout';

type Slide = {
    tmdb_id: string;
    title: string;
    rating: string;
    genre: string;
};

type Data = {
    genres: string[];
    slides: Slide[];
};

export default function IsotopeGallery({data}: { data: Data }) {
    const isotopeInstance = useRef<Isotope | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridRef.current) {
            isotopeInstance.current = new Isotope(gridRef.current, {
                itemSelector: '.grid-item',
                layoutMode: 'fitRows',
            });
        }

        return () => {
            isotopeInstance.current?.destroy();
            isotopeInstance.current = null;
        };
    }, []);

    const filterItems = (filter: string) => {
        isotopeInstance.current?.arrange({
            filter: filter === '*' ? '*' : `.${filter}`,
        });
    };

    return (
        <div>
            <div className="filter-buttons">
                <button className="btn" onClick={() => filterItems('*')}>
                    Show All
                </button>
                {data.genres.map((genre) => (
                    <button className="btn" key={genre} onClick={() => filterItems(genre)}>
                        {genre}
                    </button>
                ))}
            </div>
            <div className="grid" ref={gridRef}>
                {data.slides.map((item, index) => (
                    <div key={index} className={`grid-item ${item.genre}`}>
                        <Link href={`/recommenders/${item.tmdb_id}`}>
                            <Image
                                priority={true}
                                alt={item.title}
                                width={88 * parseFloat(item.rating) / 2.5}
                                height={132 * parseFloat(item.rating) / 2.5}
                                title={item.title}
                                src={`/images/posters/tmdb/${item.tmdb_id}/300x450.jpg`}
                                className="m-1"
                                onError={(e) => (e.currentTarget.src = '/images/fallback.jpg')} // Optional fallback image
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
