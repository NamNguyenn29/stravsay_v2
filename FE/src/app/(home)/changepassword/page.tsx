

import ChangePasswordPage from "@/components/home/Chagepassword";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordPage />
    </Suspense>
  );
}
