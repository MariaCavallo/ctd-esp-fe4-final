import type {GetStaticProps, NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "../components/layouts/body/single/body-single";
import Home, { ComicsProps } from '../components/home';
import { getComics } from 'src/services/marvel/marvel.service';

interface IndexProps {
    comicsData: ComicsProps[];
}

const Index: NextPage<IndexProps> = ({ comicsData  }) => {
    return (
        <>
            <Head>
                <title>DH-Marvel</title>
            </Head>
            <BodySingle title={"Comics"}>
                <Home comicsData={comicsData} />
            </BodySingle>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {

    const ITEMS_PER_PAGE = 12; 
    const dataComics = await getComics(0, ITEMS_PER_PAGE);
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

export default Index
