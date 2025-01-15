// components/FlickityCarousel.tsx
'use client';

import React, {useEffect, useRef} from 'react';
import Flickity from 'flickity';

import 'flickity/css/flickity.css'; // Import Flickity styles

interface FlickityCarouselProps {
    options?: Flickity.Options; // Add options prop for customization
    children: React.ReactNode;
}

const defaultFlickityOptions: Flickity.Options = {
    cellAlign: 'center',
    contain: true,
    wrapAround: true,
    autoPlay: true,
    lazyLoad: true,
    imagesLoaded: true,
    pageDots: false
};

const FlickityCarousel: React.FC<FlickityCarouselProps> = ({options = {}, children}) => {
    const flickityRef = useRef<HTMLDivElement>(null);
    const flickityInstance = useRef<Flickity | null>(null);

    useEffect(() => {
        // Merge custom options with defaults
        const mergedOptions = {...defaultFlickityOptions, ...options};
        // Initialize Flickity instance
        if (flickityRef.current) {
            flickityInstance.current = new Flickity(flickityRef.current,  mergedOptions);
        }

        return () => {
            // Destroy Flickity instance on component unmount
            flickityInstance.current?.destroy();
        };
    }, [options]);

    return (
        <div ref={flickityRef}>
            {children}
            {/*{children && Object(children).map((child: string, index: number) => (*/}
            {/*    <div key={index} className="carousel-cell p-1">*/}
            {/*        {child}*/}
            {/*    </div>*/}
            {/*))}*/}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'red'}}>Slide 1*/}
            {/*</div>*/}
        </div>
    );
};

export default FlickityCarousel;
