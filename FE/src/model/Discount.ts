export interface Discount {
    id?: string;
    discountCode: string;
    discountValue: number;
    maxDiscountAmount?: number;
    startDate: string;
    expiredDate: string;
    minOrderAmount: number;
    discountUsage: number;
    maxUsageLimit: number;
    status: number;
}