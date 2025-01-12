'use client';

import Container from "react-bootstrap/Container";
import HandThumb from "@/components/HandThumb";
import React, {useState} from "react";
import LoadingButton from "@/components/LoadingButton";

export default function SentimentAnalysisForm({data}: { data: { text: string, label: number } }) {
    const [textareaValue, setTextareaValue] = useState(data.text);
    const [labelValue] = useState(data.label);
    const [loading, setLoading] = useState(false);
    const [scores, setScores] = useState([] as [string, number][] | undefined);
    const [error, setError] = useState('');

    const handleAction = async () => {
        setLoading(true); // Set loading to true
        setScores(undefined); // Clear previous scores
        setError(''); // Clear previous error
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sentiments/check/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: textareaValue,
                    label: labelValue
                })
            }).then(response => response.json())
                .then(data => {
                    console.log('data:', data);
                    setScores(data);
                }).finally(() => {
                    setLoading(false);
                });
        } catch (err: unknown) {
            console.log('ERROR:', err);
            const errorMessage = (err instanceof Error) ? err.message : "An error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h3 className={'text-center'}>LLM - Sentiment Analysis</h3>
            <div className="form-floating">
                <textarea
                    id="reviewTextarea"
                    style={{minHeight: '10rem'}}
                    className="form-control"
                    placeholder="Leave a comment here"
                    defaultValue={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                ></textarea>
                <label htmlFor="reviewTextarea">
                    <HandThumb score={labelValue}/>Review Text:
                </label>
            </div>
            <div className="m-3">
                <LoadingButton
                    onButtonClickAction={handleAction}
                    loading={loading}
                    label={'Sentiment Analysis'}
                />
                {scores && scores.map((score, i) => (
                    <h3 key={i}>{score[0]}: <HandThumb score={score[1]}/></h3>
                ))}
                {error && <p style={{color: "red"}}>Error: {error}</p>}
            </div>
        </Container>
    );
}