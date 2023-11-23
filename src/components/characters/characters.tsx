import React, { FC } from 'react'
import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material';
import Image from 'next/image';

export interface CharactersProps {
    id: number,
    name: string,
    description: string,
    thumbnail: {
        path: string,
        extension: string,
    },
    resourceURI: string,
}

interface Props {
    data: CharactersProps;
}

const Characters: FC<Props> = ({ data }) => {

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 2 }}>
            {data && (
                <Container>
                    <Paper sx={{ width: 350, height: 600}}>
                        <Card sx={{ display: "flex", flexDirection: "column" , width: 350, height: 600 }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Image src={`${data.thumbnail.path}.${data.thumbnail.extension}`} alt={data.name} width={300} height={400}/>
                            </CardContent>
                            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant={'h5'} fontWeight={700} sx={{ color: "#1E88E5", textAlign: 'center' }}>{data.name}</Typography>
                                <Typography textAlign={'center'} sx={{ margin: 2 }}>
                                    {data.description.length > 0 ? (
                                        <span>{data.description}</span>
                                    ) : (
                                        <span>This character has no description</span>
                                    )}
                                </Typography>
                            </Box>
                        </Card>
                    </Paper>
                </Container>
            )}
        </Box>
    )
}

export default Characters