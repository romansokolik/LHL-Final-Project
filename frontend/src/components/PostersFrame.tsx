import Link from "next/link";
import Image from "next/image";

type Movie = {
    id: number;
    title: string;
    rating: number;
    genre: string;
    original_title: string;
    score: number;
};

export default function PostersFrame({data}: { data: Movie[] }) {
    return (
        <>
            {data?.map((movie: Movie, i: number) => (
                <Link key={i} className={'m-0 p-0'} href={`/recommenders/${movie.id}`}>
                    <Image src={`/images/posters/tmdb/${movie.id}/300x450.jpg`}
                           alt={String(movie.score)} title={String(movie.score)} width={88}
                           height={132} priority={false} className={'m-1'}/>
                </Link>
            ))
            }
        </>
    );
}