export type ApiResponse<T> = {
    totalPage: number
    currentPage: number
    pageSize: number
    totalElement: number
    list: T[] | []
    object: T | null
    code: string | null
    message: string | null
    isSuccess: boolean | null
    string: string | null
    int: number | null
}