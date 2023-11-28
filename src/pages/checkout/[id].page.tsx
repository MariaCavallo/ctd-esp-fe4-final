import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React from 'react'
import Checkout from 'src/components/checkout/checkout'
import { CheckoutInput } from 'src/features/checkout/checkout.types';
import { getComic, getComics } from 'src/services/marvel/marvel.service';

interface Props {
    data: CheckoutInput['order'];
}

const Index: NextPage<Props> = ({ data }) => {
    
    return (
        <div>
            <Checkout data={data}/>
        </div>
    )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const comicId = params?.id as string;
    const comic = await getComic(parseInt(comicId, 10));
    const data: CheckoutInput['order'] = {
        name: comic.title,
        image: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
        price: comic.price
    }

    return {
        props: {
            data
        },
        revalidate: 10,
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const comics = await getComics();
    const paths = comics.data.results.map((comic: { id: number }) => ({
        params: {
            id: `${comic.id}`
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export default Index