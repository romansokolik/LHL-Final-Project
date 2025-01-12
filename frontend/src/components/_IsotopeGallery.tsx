'use client';

// import '../../static/styles/isotope.styles';
import Isotope from 'isotope-layout';
import {useEffect, useRef} from 'react';
import Image from "next/image";
import Link from "next/link";

type Data = {
    genres: string[];
    slides: string[][];
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
            // Cleanup Isotope instance on unmount
            isotopeInstance.current?.destroy();
        };
    }, []);

    const filterItems = (filter: string) => {
        isotopeInstance.current?.arrange({
            filter: filter === '*' ? '*' : `.${filter}`,
        });
    };

    return (
        <div>
            <div>
                <button className={'btn'} onClick={() => filterItems('*')}>Show All</button>
                {data.genres && data.genres.map((genre: string) => (
                    <button className={'btn'} key={genre} onClick={() => filterItems(genre)}>{genre}</button>
                ))}
            </div>
            <div className="grid" ref={gridRef}>
                {data.slides && data.slides.map((item: object, index: number) => (
                    <div key={index} className={`grid-item ${item.genres}`}>
                        <Link href={`/recommenders/${item.tmdb_id}`}>
                            <Image alt={item.title} width={88 * parseFloat(item.rating) / 2.5}
                                   height={132 * parseFloat(item.rating) / 2.5}
                                   title={item.title}
                                   src={'/images/posters/tmdb/' + item.tmdb_id + '/w220_and_h330_face.jpg'}
                                   className={'m-1'}/>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
