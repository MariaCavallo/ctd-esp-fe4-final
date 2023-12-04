import React from 'react'
import Characters, { CharactersProps } from 'src/components/characters/characters'
import { GetServerSideProps, GetStaticPaths, NextPage } from 'next';
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const characterId = params?.id as string;
    const character = await getCharacter(parseInt(characterId, 10))

    return {
        props: {
            data: character,
        },
    }
}

export default Index