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

    const response = await getComics();
    const data = await response;
    console.log(data);
    
    return {
        props: {
            comicsData: data.data.results,
            pagData: data.data,
        },
    };
}

export default Index
