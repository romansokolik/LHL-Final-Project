import SentimentAnalysisForm from "@/components/SentimentAnalysisForm";

type SentimentData = {
    text: string;
    label: number;
};

export default async function Page() {
    let data: SentimentData | null = null;

    try {
        console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sentiments/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        data = await response.json() as SentimentData;
    } catch (e) {
        console.error("Error fetching data:", e);
    }

    if (!data) {
        return <div>Error loading data. Please try again later.</div>;
    }

    return (
        <SentimentAnalysisForm data={data}/>
    );
}
