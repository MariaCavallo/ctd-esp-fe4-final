import type {NextPage} from 'next'
import Head from 'next/head'
import BodySingle from "../components/layouts/body/single/body-single";
import Home, { ComicsProps } from './home/home';

interface IndexProps {
    comicsData: ComicsProps[];
}

const Index: NextPage<IndexProps> = ({ comicsData }) => {
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

export default Index
