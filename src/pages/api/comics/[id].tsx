import { NextApiRequest, NextApiResponse } from 'next';
import { getComic } from '../../../services/marvel/marvel.service';

export default async function handlerComicId(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET' && id) {
        const comicId = parseInt(id as string, 10);
        const comic = await getComic(comicId);

        if (comic) {
            res.status(200).json(comic);
        } else {
            res.status(404).json({ message: 'Cómic no encontrado' });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}