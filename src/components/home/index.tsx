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

interface HomeProps {
    comicsData: ComicsProps[];
}

const Home: NextPage<HomeProps> = ({ comicsData }) => {
    
    const [comics, setComics] = useState<ComicsProps[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 20;
    
//TODO ---------   Arreglar paginacion    ---------------
    const handlePageChange = async (offset: number, limit: number) => {
        try{
            const response = await getComics(offset, limit);
            setComics(response.data.results);
            setCurrentPage(offset / limit);
        } catch (error) {
            console.log('Error al obtener comics:',error);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Button variant="contained" color="error" disabled={comics.length < limit} onClick={() => handlePageChange(currentPage - limit, limit)}>
                    Previous
                </Button>
                <Button variant="contained" disabled={comics.length > limit} onClick={() => handlePageChange(currentPage + limit, limit * 2)}>
                    Next
                </Button>
            </Container>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 0 }} sx={{ display: 'flex', justifyContent: 'center'}}>
                {comicsData?.map((comic) => (
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
                                <Button size="small" variant="contained">Buy</Button>
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