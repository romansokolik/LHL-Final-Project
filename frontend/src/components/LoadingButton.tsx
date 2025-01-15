'use client'

import {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'

type LoadingButtonProps = {
    onButtonClickAction: () => void; // Define the function's type
    loading?: boolean; // Optional prop
    label: string;
    classes?: string;
};

export default function LoadingButton({onButtonClickAction, loading, label, classes}: LoadingButtonProps) {
    const [isLoading, setIsLoading] = useState(loading || false);

    useEffect(() => {
        // Sync isLoading with the external loading prop
        setIsLoading(!!loading);
        console.log('loading:', loading);
    }, [loading]);

    const handleClick = () => {
        setIsLoading(true); // Set loading state to true
        onButtonClickAction(); // Call the action
    };

    return (
        <Button
            variant="primary"
            disabled={isLoading} // Disable button if loading
            onClick={!isLoading ? handleClick : undefined} // Prevent double-clicks
            className={classes}
        >
            {isLoading ? 'Loading…' : label}
        </Button>
    );
}
