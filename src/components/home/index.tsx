import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import { Box, Grid, Card, Button, CardActions, CardContent, Typography, Pagination, Stack, Container } from '@mui/material'
import { getComics } from 'src/services/marvel/marvel.service'
import Link from 'next/link'

export interface ComicsProps {
    id: number,
    title: string,
    thumbnail: {
        path: string,
        extension: string,
    }
}

export interface PaginationProps {
    offset: number,
    limit: number,
    total: number,
    count: number
}

interface HomeProps {
    comicsData: ComicsProps[];
    pagData: PaginationProps;
}

const Home: NextPage<HomeProps> = ({ comicsData, pagData }) => {
    
    const [comics, setComics] = useState<ComicsProps[]>(comicsData);
    const [offset, setOffset] = useState<number>(pagData.offset);
    const [limit, setLimit] = useState<number>(pagData.limit);
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://gateway.marvel.com/v1/public/comics?ts=1699966256616&apikey=d279a9f11f2c2a902a340aeaa5d21ee1&hash=a5b4d491e755602d50aa9898de7f7018&offset=${offset}&limit=${limit}`);
            const data = await response.json()

            setComics(data.data.results);
            setOffset(data.data.offset);
            setLimit(data.data.limit);
        }

        fetchData();

    }, [limit, offset])
    
    const handleChangePage = (newOffset: number, newLimit: number) => {
        setOffset(newOffset);
        setLimit(newLimit);
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <Pagination 
                    count={pagData?.total} 
                    page={(offset / limit) + 1} 
                    color="primary" 
                    onChange={(_event, page) => {
                        const newOffset = (page - 1) * limit;
                        handleChangePage(newOffset, limit);
                    }} />
            </Container>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 0 }} sx={{ display: 'flex', justifyContent: 'center'}}>
                {comicsData.map((comic) => (
                    <Grid xs={12} sm={6} md={4} lg={3} key={comic.id} sx={{ margin: 1 }}>
                        <Card sx={{ width: 320, height: 350, display: "flex", flexDirection: "column", alignItems: 'center', marginBottom: "30px", border: "2px solid #1E88E5"}}>
                            <Image
                                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} 
                                alt={comic.title}
                                width={220} 
                                height={250} 
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" color={"#0D47A1"}>
                                    {comic.title}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Link href={`/checkout/${comic.id}`}>
                                    <Button size="small" variant="contained">Buy</Button>
                                </Link>
                                <Link href={`/comics/${comic.id}`}>
                                    <Button size="small" variant="outlined">See details</Button>
                                </Link>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default Home