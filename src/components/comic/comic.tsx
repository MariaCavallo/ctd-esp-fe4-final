import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getComic } from 'src/services/marvel/marvel.service';
import { Box, Container, Typography, Paper, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface ComicProps {
    id: number;
    title: string;
    description: string;
    thumbnail: {
        path: string;
        extension: string;
    };
    prices: {
        type: string;
        price: number;
    };
    characters: {
        items: {
            url: string;
            name: string;
        };
    };
}

interface Props {
    data: ComicProps;
}

const Comic: FC<Props> = ({ data }) => {

    const router = useRouter();

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
            {data && (
                <Container key={data.id}>
                    <Typography variant={"h2"} textAlign={"center"} fontSize={28} fontWeight={500} sx={{ color: "#0D47A1", margin: 2 }}>{data.title}</Typography>
                    <Paper sx={{ width: 600, height: 450}} >
                        <Card sx={{ width: 600, height: 450, display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around" }}>
                            <CardContent>
                                <Image src={`${data.thumbnail.path}.${data.thumbnail.extension}`} alt={data.title} width={300} height={400} />
                            </CardContent>
                            <Box>
                                <Typography variant={'h6'} fontWeight={700} sx={{ color: "#1E88E5" }}>{data.title}</Typography>
                                <Typography>{data.prices.price}</Typography>
                            </Box>
                        </Card>
                    </Paper>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a"
                        >
                            <Typography>
                                Description
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {data.description}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a"
                        >
                            <Typography>
                                Characters
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <Link href={`${data.characters.items.url}`}>
                                    <a>{data.characters.items.name}</a>
                                </Link>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            )}
        </Box>
    )
}

export default Comic