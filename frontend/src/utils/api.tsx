import axios from 'axios';

// console.log('environment type:', process.env.NODE_ENV);
// console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
export const fetchItems = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}`);
    // console.log('response:', response)
    return response.data;
};

export const checkItems = async (data: string[]) => {
    return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/check`, data);
}

export const fetchGetData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check/`);
    return await response.json();
};

export const _fetchPostData = async (name: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
    });
    return await response.json();
};

export const fetchPostData = async (name: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/check/`, name);
    return res.data;
}
