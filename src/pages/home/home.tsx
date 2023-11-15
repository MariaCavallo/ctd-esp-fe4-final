import { Box, Grid, Card, Button, CardActions, CardContent, CardMedia, Typography, Pagination, Stack } from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import React, { useState } from 'react'
import { getComics } from 'src/services/marvel/marvel.service'

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

const Home: NextPage<HomeProps> = ({ comicsData: initialComicsData }) => {

    const [comicsData, setComicsData] = useState(initialComicsData);

    const handlePageChange = async (page: number) => {
        const offset = (page - 1) * 12;
        const dataComics = await getComics(offset, 12);
        setComicsData(dataComics);
    };

    return (
        <Box>
            <Stack spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Pagination count={4555} color="primary" onChange={(event, page) => handlePageChange(page)} />
            </Stack>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {comicsData?.map((comic) => (
                    <Grid xs={2} sm={4} md={4} key={comic.id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image={comic.thumbnail.path + '.' + comic.thumbnail.extension}
                                title={comic.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {comic.title}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" variant="contained">Ver detalle</Button>
                                <Button size="small" variant="outlined">Comprar</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const ITEMS_PER_PAGE = 12; 
    const dataComics = await getComics(0, ITEMS_PER_PAGE);
    console.log("Data from getStaticProps:", dataComics); 
    const allComics = dataComics.map((comic: any) => ({
        id: comic.id,
        title: comic.title,
        thumbnail: {
            path: comic.thumbnail.path,
            extension: comic.thumbnail.extension
        },
    }));

    return {
        props: {
            comicsData: allComics,
        },
    };
}

export default Home