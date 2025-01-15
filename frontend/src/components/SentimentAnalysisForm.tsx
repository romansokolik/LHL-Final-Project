'use client';

import Container from "react-bootstrap/Container";
import HandThumb from "@/components/HandThumb";
import React, {useState} from "react";
import LoadingButton from "@/components/LoadingButton";
import {Accordion, Col, Row} from "react-bootstrap";

export default function SentimentAnalysisForm({data}: { data: { text: string, label: number } }) {
    const [textareaValue, setTextareaValue] = useState(data.text);
    const [labelValue] = useState(data.label);
    const [loading, setLoading] = useState(false);
    const [scores, setScores] = useState([] as [string, number][] | undefined);
    const [reports, setReports] = useState([] as [] | undefined);
    const [predictions, setPredictions] = useState([] as [] | undefined);

    // const [nlps, setNlps] = useState([] as [string, number][] | undefined);
    // const [configs, setConfigs] = useState([] as [string, number][] | undefined);
    // const [tokenizers, setTokenizers] = useState([] as [string, number][] | undefined);
    // const [models, setModels] = useState([] as [string, number][] | undefined);
    // const [labels_trues, setLabelsTrues] = useState([] as [string, number][] | undefined);
    const [error, setError] = useState('');

    const handleAction = async () => {
        setLoading(true); // Set loading to true
        setScores(undefined); // Clear previous scores
        setReports(undefined); // Clear previous reports
        setPredictions(undefined); // Clear previous predictions
        // setNlps(undefined); // Clear previous nlps
        // setConfigs(undefined); // Clear previous configs
        // setTokenizers(undefined); // Clear previous tokenizers
        // setModels(undefined); // Clear previous models
        // setLabelsTrues(undefined); // Clear previous labels_trues
        setError(''); // Clear previous error
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sentiments/check/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    text: textareaValue,
                    label: labelValue
                })
                // }).then(response => console.log('response:', typeof response, response.json()))
            }).then(response => response.json())
                .then(data => {
                    // console.log('data:', data);
                    setScores(data.results.scores);
                    setReports(data.results.reports.map((report: object) => Object(report)[1]));
                    setPredictions(data.results.predictions.map((prediction: object) => Object(prediction)[1][0]));
                    // setNlps(data[3].nlps);
                    // setConfigs(data[4].configs);
                    // setTokenizers(data[5].tokenizers);
                    // setModels(data[6].models);
                    // setLabelsTrues(data[7].labels_trues);
                    // console.log('prediction_labels:', typeof data[5]);
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
            <div className="container my-3">
                <LoadingButton classes={'btn-lg'}
                               onButtonClickAction={handleAction}
                               loading={loading}
                               label={'Sentiment Analysis'}
                />
            </div>
            {/*{scores && <pre>SCORES:{JSON.stringify(scores[0], null, 2)}</pre>}*/}
            {/*{reports && <pre>REPORTS:{JSON.stringify(reports[0], null, 2)}</pre>}*/}
            {/*{predictions && <pre>PREDICTIONS:{JSON.stringify(predictions[0], null, 2)}</pre>}*/}
            {/*{nlps && <pre>NLPS:{JSON.stringify(nlps[0], null, 2)}</pre>}*/}
            {/*{configs && <pre>CONFIGS:{JSON.stringify(configs[0], null, 2)}</pre>}*/}
            {/*{tokenizers && <pre>TOKENIZERS:{JSON.stringify(tokenizers[0], null, 2)}</pre>}*/}
            {/*{models && <pre>MODELS:{JSON.stringify(models[0], null, 2)}</pre>}*/}
            {/*{labels_trues && <pre>LABELS TRUE:{JSON.stringify(labels_trues[0], null, 2)}</pre>}*/}
            <Accordion className={'accordion-flush'} defaultActiveKey={String(0)}>
                {scores && reports && predictions && scores.map((score, i) => (
                        <Accordion.Item eventKey={String(i)} key={i}>
                            <Accordion.Header>
                                <HandThumb score={score[1]} rem={2}/>
                                <span className={'h1'}>{score[0]}</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <p>SCORE: {Object(predictions[i]).score}</p>
                                <p>REPORTS:</p>
                                {Object.keys(reports[i]).map((key: string, n: number) => (
                                        <Container key={n}>
                                            <Row className={'row-cols-auto'}>
                                                <Col className={'col-2'}><b>{key}</b></Col>
                                                {typeof reports[i][key] != 'object' &&
                                                    <Col>{reports[i][key]}</Col>
                                                }
                                                {Object.keys(reports[i][key]).map((y, x) => (
                                                    <Col key={x}>{y} : {reports[i][key][y]}</Col>
                                                ))}
                                            </Row>
                                        </Container>
                                    )
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                )}
            </Accordion>
            {
                error && <p style={{color: "red"}}>Error: {error}</p>
            }
        </Container>
    );
}