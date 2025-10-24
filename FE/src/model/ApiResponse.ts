export type ApiResponse<T> = {
    totalPage: number | null
    currentPage: number | null
    list: T[] | []
    object: T | null
    code: string | null
    message: string | null
    isSuccess: boolean | null
    string: string | null
    int: number | null
}