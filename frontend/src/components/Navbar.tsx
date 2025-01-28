import Link from "next/link";
import Container from "react-bootstrap/Container";
import Hamburger from "@/components/Hamburger";
// import SearchForm from "@/components/SearchForm";
import StopWatch from "@/components/StopWatch";

export default function Navbar() {
    const links = [
        {href: "/about/", text: "About"},
        {href: "/datasets/", text: "Datasets"},
        {href: "/recommenders/", text: "Recommenders"},
        {href: "/sentiment-analysis/", text: "Sentiment Analysis"},
        {href: "/references/", text: "References"},
    ];
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark my-0 py-1">
            <Container fluid>
                <Link className="navbar-brand" href="/">
                    {/*<Image src={'/images/falcon.png'}  priority={true}*/}
                    {/*       width={40} height={40} alt={'Roman Sokolik'} title={'Roman Sokolik'}/>*/}
                    Roman Sokolik
                </Link>

                <Hamburger/>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {links.map((link, i) => (
                            <li key={i} className="nav-item">
                                <Link className="nav-link active" aria-current="page" href={link.href
                                }>{link.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {/*<SearchForm/>*/}
                </div>
                <StopWatch/>
            </Container>
        </nav>
    );
}