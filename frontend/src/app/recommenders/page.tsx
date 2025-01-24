import IsotopeGallery from "@/components/IsotopeGallery";
import axios from "axios";

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

export default async function Page() {
    let data: Data | null = null;

    try {
        const response = await axios.get<Data>(`${process.env.NEXT_PUBLIC_API_URL}/recommenders/`);
        data = response.data;
    } catch (e) {
        console.error("Error fetching data:", e);
    }

    // Handle case where data is null
    if (!data) {
        return <p>Error loading data</p>;
    }

    return <IsotopeGallery data={data}/>;
}
