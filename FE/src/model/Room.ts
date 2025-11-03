export type Room = {
    id: string;
    roomName: string;
    roomNumber: number;
    description: string;
    imageUrl: string[];
    floor: number;
    status: number;
    createdDate: string;
    typeName: string;
    roomTypeID: string;
    // basePrice: number;
    price: number;
    bedType: string;
    space: number;
    hasBreakFast: boolean;
    adult: number;
    children: number;
}