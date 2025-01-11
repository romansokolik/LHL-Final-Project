import SentimentAnalysisForm from "@/components/SentimentAnalysisForm";

export default async function Page() {
    let data: { text: string, label: number }
    try {
        console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
        data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sentiments/`)
            .then((res) => res.json()
                .then((data) => {
                    // console.log('data:', data['text']);
                    return data;
                })
            );
    } catch (e) {
        console.error('Error:', e);
        return []
    }
    return (
        <>
            {/*<p>{data && data['text']}</p>*/}
            <SentimentAnalysisForm data={data}/>
        </>
    );
}