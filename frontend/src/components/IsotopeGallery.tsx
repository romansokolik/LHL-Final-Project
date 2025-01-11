'use client';

import {useEffect, useRef} from 'react';
import Isotope from 'isotope-layout';
// import '../../static/css/isotope.css';
import Image from "next/image";

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
            {/*<p>{data.genres}</p>*/}
            <div className="grid" ref={gridRef}>
                {data.slides && data.slides.map((item: string[], index: number) => (
                    <div key={index} className={`grid-item ${item[2]}`}>
                        <Image alt={String(item[1])} width={88 * parseFloat(item[1])} height={132 * parseFloat(item[1])}
                               title={item.toString()}
                               src={'/images/posters/tmdb/' + item[0] + '/w220_and_h330_face.jpg'}
                               className={'m-1'}/>
                    </div>
                ))}
            </div>
        </div>
    );
}
