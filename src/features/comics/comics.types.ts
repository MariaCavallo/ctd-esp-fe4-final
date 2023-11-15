export type ComicsType = {
    id: number,
    title: string,
    image: Image
}

interface Image {
    thumbnail: {
        path: string,
        extension: string
    }
}