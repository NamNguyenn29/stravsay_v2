export interface Setting {
  id: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  status: number; // 1: Active, 0: Inactive
  updatedDate: string;
}