import type {GetStaticProps, NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "../components/layouts/body/single/body-single";
import Home, { ComicsProps, PaginationProps } from '../components/home';
import { getComics } from 'src/services/marvel/marvel.service';

interface IndexProps {
    comicsData: ComicsProps[];
    pagData: PaginationProps;
}

const Index: NextPage<IndexProps> = ({ comicsData, pagData  }) => {
    
    return (
        <>
            <Head>
                <title>DH-Marvel</title>
            </Head>
            <BodySingle title={"Comics"}>
                <Home comicsData={comicsData} pagData={pagData}/>
            </BodySingle>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {

    const ITEMS_PER_PAGE = 12; 
    const dataComics = await getComics(0, ITEMS_PER_PAGE);
    const { offset, limit } = dataComics.data;
    const dataPage = await getComics(offset, limit);

    return {
        props: {
            comicsData: dataPage.data.results,
            pagData: {
                offset,
                limit,
                total: dataPage.data.total,
                count: dataPage.data.count,
            },
        },
    }; 
}

export default Index
