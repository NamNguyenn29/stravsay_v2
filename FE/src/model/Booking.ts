export type Booking = {
    id: string,
    fullName: string,
    phone: string,
    roomNumber: string,
    roomName: string,
    checkInDate: string,
    checkOutDate: string,
    price: number,
    status: number,
    createdDate: string,
    discountCode?: number
    service?: string[]
}