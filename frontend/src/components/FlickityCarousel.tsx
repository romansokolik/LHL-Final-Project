// components/FlickityCarousel.tsx
'use client';

import React, {useEffect, useRef} from 'react';
import Flickity from 'flickity';

import 'flickity/css/flickity.css'; // Import Flickity styles

interface FlickityCarouselProps {
    options?: Flickity.Options; // Add options prop for customization
    children: React.ReactNode;
}

const FlickityCarousel: React.FC<FlickityCarouselProps> = ({options, children}) => {
    const flickityRef = useRef<HTMLDivElement>(null);
    const flickityInstance = useRef<Flickity | null>(null);

    useEffect(() => {
        if (flickityRef.current) {
            flickityInstance.current = new Flickity(flickityRef.current, options || {});
        }

        return () => {
            // Destroy Flickity instance on component unmount
            flickityInstance.current?.destroy();
        };
    }, [options]);

    return (
        <div ref={flickityRef}>
            {children}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'red'}}>Slide 1*/}
            {/*</div>*/}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'blue'}}>Slide 2*/}
            {/*</div>*/}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'green'}}>Slide 3*/}
            {/*</div>*/}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'yellow'}}>Slide 3*/}
            {/*</div>*/}
            {/*<div className="carousel-cell" style={{width: '300px', height: '200px', background: 'gold'}}>Slide 3*/}
            {/*</div>*/}
        </div>
    );
};

export default FlickityCarousel;
