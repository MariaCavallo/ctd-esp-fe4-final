import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Comic, { ComicProps } from 'src/components/comic/comic';
import { getComic, getComics } from 'src/services/marvel/marvel.service';

interface Props {
    data: ComicProps;
}

const Index: NextPage<Props> = ({ data }) => {

    return (
        <div>
            <Comic data={data}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const comicId = params?.id as string;
    const comic = await getComic(parseInt(comicId, 10))

    return {
        props: {
            data: comic,
        },
    }
}

export default Index