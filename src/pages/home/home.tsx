import { Box, Grid, Card, Button, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { GetStaticProps, NextPage } from 'next'
import React, { useState } from 'react'
import { getComics } from 'src/services/marvel/marvel.service'

export interface ComicsProps {
    id: number,
    title: string,
    image: string
}

const Home: NextPage<{comicsData: ComicsProps[]}> = ({ comicsData }) => {

    const [comics, setComics] = useState<ComicsProps[]>(comicsData)

    return (
        <Box>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {comics?.map((comic) => (
                    <Grid xs={2} sm={4} md={4} key={comic.id}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image={comic.image}
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

export const getStaticProps: GetStaticProps =async () => {
    
    const dataComics = await getComics();

    const allComics = dataComics.map((comic: any) => ({
        id: comic.id,
        title: comic.title,
        image: comic.thumbnail.path + '.' + comic.thumbnail.extension,
    }));

    return {
        props: {
            allComics,
        },
    }
}

export default Home