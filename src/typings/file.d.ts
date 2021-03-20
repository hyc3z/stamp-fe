interface FileMeta {
    id: string,
    name: string,
    isDirectory: boolean,
    size: number,
    items: FileMeta[]
}