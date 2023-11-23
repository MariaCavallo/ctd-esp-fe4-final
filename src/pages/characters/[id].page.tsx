import React from 'react'
import Characters, { CharactersProps } from 'src/components/characters/characters'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getCharacter, getCharacters } from 'src/services/marvel/marvel.service';

interface Props {
    data: CharactersProps;
}

const Index: NextPage<Props> = ({ data }) => {
    return (
        <div>
            <Characters data={data}/>
        </div>
    )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const characterId = params?.id as string;
    const character = await getCharacter(parseInt(characterId, 10))

    return {
        props: {
            data: character,
        },
        revalidate: 10
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const characters = await getCharacters()
    const paths = characters.map((characters: { id: any; }) => ({
        params: { 
            id: `${characters.id}`
        }
    }))

    return {
        paths,
        fallback: 'blocking',
    }
}

export default Index