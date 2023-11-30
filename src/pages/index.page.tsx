import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import BodySingle from "../components/layouts/body/single/body-single";
import Home, { ComicsProps } from '../components/home';
import { getComics } from 'src/services/marvel/marvel.service';

interface IndexProps {
    comicsData: ComicsProps[];
    totalPages: number;
    currentPage: number;
}

const Index: NextPage<IndexProps> = ({ comicsData, totalPages, currentPage }) => {

    return (
        <>
            <Head>
                <title>DH-Marvel</title>
            </Head>
            <BodySingle title={"Comics"}>
                <Home comicsData={comicsData} totalPages={totalPages} currentPages={currentPage} />
            </BodySingle>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const ITEMS_PER_PAGE = 12;
    const currentPage = query.page ? Number(query.page) : 1;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const data = await getComics(offset, ITEMS_PER_PAGE);
    const comics = data.data.results;
    const totalComics = data.data.total;
    const totalPages = Math.ceil(totalComics / ITEMS_PER_PAGE);

    return {
        props: {
            comicsData: comics,
            totalPages,
            currentPage
        },
    };
};

export default Index
