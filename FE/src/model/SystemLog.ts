export interface SystemLog {
  id: string;
  userId: string | null;
  userName: string | null;
  ipAddress: string | null;
  status: boolean;
  action:string;
  createdDate: string;
}