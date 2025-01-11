import IsotopeGallery from "@/components/IsotopeGallery";

export default async function Page() {
    let data: { genres: string[], slides: string[][] }
    try {
        data = await fetch(`${process.env.API_HOST}/api/`)
            .then((res) => res.json()
                .then((data) => {
                    return data;
                })
            );
    } catch (e) {
        console.error('Error:', e);
        return []
    }
    return (
        <>
            <IsotopeGallery data={data}/>
        </>
    );
}
