import axios from 'axios';
// console.log('environment type:', process.env.NODE_ENV);
// console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)

const api_url = process.env.NEXT_PUBLIC_API_URL;

export const fetch_home_items = async () => {
    const response = await axios.get(`${api_url}`);
    // console.log('response:', response)
    return response.data;
};

export const fetch_isotope_items = async () => {
    const response = await axios.get(`${api_url}/recommenders/`);
    // console.log('response:', response.data)
    return response.data;
};

// interface RecommenderResponse {
//     recommendations: string[];
//     // Add other fields as needed
// }

export const fetch_recommender_data = async (mode: string, id: number) => {
    const url = `${api_url}/recommenders/${mode}/${id}`;
    // console.log('url:', url);
    const response = await axios.get(url);
    return response.data;
}

export default function exec_recommender_search(id: number) {
    const url = `${api_url}/recommenders/compare-poster/${id}`;
    // console.log('url:', url);
    return fetch(url)
}


export const check_items = async (data: string[]) => {
    return await axios.post(`${api_url}/check`, data);
};

export const fetch_get_data = async () => {
    const response = await fetch(`${api_url}/check/`);
    return await response.json();
};

export const _fetch_post_data = async (name: string) => {
    const response = await fetch(`${api_url}/check/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
    });
    return await response.json();
};

export const fetch_post_data = async (name: string) => {
    const res = await axios.post(`${api_url}/check/`, name);
    return res.data;
}
