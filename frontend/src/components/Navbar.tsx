import Link from "next/link";
import Container from "react-bootstrap/Container";
import Hamburger from "@/components/Hamburger";
import SearchForm from "@/components/SearchForm";

export default function Navbar() {
    const links = [
        {href: "/sentiment-analysis/", text: "Sentiment Analysis"},
        {href: "/recommenders/", text: "Recommenders"},
    ];
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <Container fluid>
                <Link className="navbar-brand" href="/">LHL Final Project</Link>
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
            </Container>
        </nav>
    );
}