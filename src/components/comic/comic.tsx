import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Box, Container, Typography, Paper, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface ComicProps {
    id: number,
    title: string,
    description: string,
    thumbnail: {
        path: string,
        extension: string,
    },
    price: number,
    oldPrice: number,
    stock: number,
    characters: {
        items: [
            {
                resourceURI: string,
                name: string,
            },
        ],
    },
}

interface Props {
    data: ComicProps;
}

const Comic: FC<Props> = ({ data }) => {

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
            {data && (
                <Container sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", alignContent: "center", alignItems: "center" }} key={data.id}>
                    <Typography variant={"h2"} textAlign={"center"} fontSize={28} fontWeight={500} sx={{ color: "#0D47A1", margin: 2 }}>{data.title}</Typography>
                    <Paper sx={{ width: 700, height: 400}} >
                        <Card sx={{ display: "flex", flexDirection: "row" , width: 700, height: 400 }}>
                            <CardContent>
                                <Image src={`${data.thumbnail.path}.${data.thumbnail.extension}`} alt={data.title} width={300} height={400} />
                            </CardContent>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around"  }}>
                                <Box>
                                    <Typography variant={'h6'} fontWeight={700} sx={{ color: "#1E88E5", textAlign: 'center' }}>{data.title}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ color: "#bd1b1b", opacity: 0.5 }} >Before: $<span style={{ fontWeight: 600 }}>{data.oldPrice}</span></Typography>
                                    <Typography variant={'h6'} sx={{ color: "#1E88E5" }} >Now: $<span style={{ fontWeight: 600 }}>{data.price}</span></Typography>
                                </Box>
                                <Box>
                                    {data.stock !== 0 ? (
                                        <Button variant="contained" sx={{ width: 350 }}>Buy</Button>
                                    ) : (
                                        <Button variant="contained" disabled sx={{ width: 350 }}>No Stock</Button>
                                    )}
                                </Box>
                            </Box>
                        </Card>
                    </Paper>
                    <Accordion sx={{ width: 700 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a"
                        >
                            <Typography variant={'h6'} fontWeight={600} color={"#0D47A1"}>
                                Description
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {data.description.length > 0 ? (
                                    <span>{data.description}</span>
                                ) : (
                                    <span>There is not description for this comic</span>
                                )}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion sx={{ width: 700 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a"
                        >
                            <Typography variant={'h6'} fontWeight={600} color={"#0D47A1"}>
                                Characters
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {data.characters && data.characters.items.length > 0 ? (
                                    data.characters.items.map((character) => {
                                        const characterId = character.resourceURI.split('/').pop();
                                            return (
                                                <li style={{ listStyle: 'none', padding: '5px', textAlign: 'center' }} key={character.name}>
                                                    <Link href={`/characters/${characterId}`}>
                                                        <a style={{ fontWeight: 500, color: "#167dd6", fontStyle: 'italic' }}>{character.name}</a>
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    )
                                ) : (
                                    <span>There are not characters for this comic</span>
                                )}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            )}
        </Box>
    )
}

export default Comic