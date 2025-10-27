export type Room = {
    id: string;
    roomName: string;
    roomNumber: number;
    description: string;
    imageUrl: string[];
    floor: number;
    status: string;
    createdDate: string;
    typeName: string;
    roomTypeID: string;
    basePrice: number;
    bedType: string;
    space: number;
    hasBreakFast: boolean;
    adult: number;
    children: number;
}