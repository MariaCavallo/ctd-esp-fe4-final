import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import { Box, Grid, Card, Button, CardActions, CardContent, Typography, Container } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PaginationComponent from '../pagination/pagination'

export interface ComicsProps {
    id: number,
    title: string,
    thumbnail: {
        path: string,
        extension: string,
    }
}

interface HomeProps {
    comicsData: ComicsProps[];
    totalPages: number;
    currentPages: number;
}

const Home: NextPage<HomeProps> = ({ comicsData, totalPages, currentPages }) => {

    const [loading, setLoading] = useState(false);

    const route = useRouter();

    const handlePageChange = async (event: React.ChangeEvent<unknown>, page: number) => {
        setLoading(true);
        await route.push(`/?page=${page}`);
        setLoading(false)
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <PaginationComponent 
                    totalPage={totalPages}
                    currentPage={currentPages}
                    onChange={handlePageChange}
                />
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
                                <Typography gutterBottom variant="h6" component="div" color={"#0D47A1"}>
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