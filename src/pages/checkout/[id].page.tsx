import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
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
    }
}

export default Index