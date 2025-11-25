export type Booking = {
    id?: string,
    fullName: string,
    phone: string,
    roomNumber: string,
    roomName: string,
    roomId: string,
    userId: string,
    checkInDate: string,
    checkOutDate: string,
    price: number,
    status: number,
    createdDate: string,
    adult: number,
    children: number,
    discountCode?: number,
    services?: string[]
}
