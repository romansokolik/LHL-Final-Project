// import {Geist, Geist_Mono} from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// import 'flickity/dist/flickity.min.styles';
// import "./globals.styles";
import React from "react";
import Navbar from "@/components/Navbar";
import BootstrapScripts from "@/components/BootstrapScripts";
import Container from "react-bootstrap/Container";
import Footer from "@/components/Footer";
// import Script from "next/script";

export const metadata = {
    title: "LHL Final Project",
    description: "LightHouse Labs Immersive BootCamp",
};

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export default function Layout(
    {children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <title>{metadata.title}</title>
            <link rel={'icon'} href={'favicon.ico'}/>
        </head>
        {/*<body className={`${geistSans.variable} ${geistMono.variable} bg-body-tertiary`}>*/}
        <body className={' bg-body-tertiary'}>
        <Container>
            <header style={{minHeight: '4.5rem'}}></header>
            <Navbar/>
        </Container>
        <main className={'container'}>{children}</main>
        <Footer/>
        <BootstrapScripts/>
        {/*<Script type={'text/javascript'} src={'/static/js/flickity.pkgd.min.js'}/>*/}
        {/*<Script type={'text/javascript'} src={'/static/js/isotope.pkgd.min.js'}></Script>*/}
        </body>
        </html>
)
}
