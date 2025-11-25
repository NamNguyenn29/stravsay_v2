export interface Review {
    reviewID?: string;
    bookingID: string;
    userID?: string;
    rating: number;
    title?: string;
    content?: string;
    createdDate?: string;
    updatedDate?: string;
    userName?: string;
}