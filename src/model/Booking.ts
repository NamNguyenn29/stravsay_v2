export type Booking = {
    id: string,
    userId: string,
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    price: number,
    status: number,
    createdDate: string,
    discountCode?: number
}