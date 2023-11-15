import { NextApiRequest, NextApiResponse } from "next";
import { getComic, getComics } from "src/services/marvel/marvel.service";

export default async function handlerComics(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (id) {
            const comicId = parseInt(id as string, 10);
            const comic = await getComic(comicId);

            if (comic) {
                res.status(200).json(comic);
            } else {
                res.status(404).json({ message: 'Cómic no encontrado' });
            }
        } else {
            const comics = await getComics();
            res.status(200).json(comics);
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}