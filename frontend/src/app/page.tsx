'use client';

import Image from "next/image";

export default function Home() {

    return (
        <div className={'d-flex h-100 text-center'}>
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <Image src={'/images/Lighthouse-Labs.png'} alt={'Lighthouse Labs'} priority={false}
                       width={480} height={100} className={'image-fluid w-25 h-auto mx-auto my-3 bg-gradient'}/>
                <h1 className={'h1'}>DATA SCIENCE - FINAL PROJECT</h1>
                <Image src={'/images/Data-Science.png'} alt={'Data Science'} priority={true}
                       width={1400} height={725} className={'image-fluid w-75 h-auto mx-auto'}/>
            </div>
        </div>
    );
}
