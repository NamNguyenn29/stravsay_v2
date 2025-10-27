// "use client"
// import { Pagination } from "antd";
// import { useState, useEffect } from "react";
// import { Discount } from "@/model/Discount";
// import { getDiscounts } from "@/api/getDiscounts";

// export default function DiscountsManagement() {
//     const [discounts, setDiscounts] = useState<Discount[]>([]);
//     useEffect(() => {
//         loadDiscounts();
//     }, [])

//     const loadDiscounts = async () => {
//         const data = await getDiscounts();
//         setDiscounts(data.list);
//     }

//     const totalDiscounts = discounts.length;
//     const respondedCount = discounts.filter(b => b.status === 0).length;
//     const pendingCount = discounts.filter(b => b.status === 1).length;

//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(5);

//     const [activeFilter, setActiveFilter] = useState<"all" | 1 | 0>("all");

//     // Tính toán dữ liệu hiển thị
//     const filteredByStatus =
//         activeFilter === "all" ? discounts : discounts.filter(r => r.status === activeFilter);

//     // phân trang
//     const indexOfLast = currentPage * itemsPerPage;
//     const indexOfFirst = indexOfLast - itemsPerPage;
//     const currentDiscounts = filteredByStatus.slice(indexOfFirst, indexOfLast);

//     const handleFilterClick = (filter: "all" | 1 | 0) => {
//         setActiveFilter(filter);
//         setCurrentPage(1);
//     };

//     const [selectedDiscountResponse, setSelectedDiscountResponse] = useState<Discount | null>(null);
//     const [selectedDiscountView, setSelectedDiscountView] = useState<Discount | null>(null);

//     return (
//         <>
//             <>
//                 <div className=" font-semibold text-lg">View All Discounts</div>
//                 <div className="my-3 border border-b-1 container  bg-black "></div>

//                 {/* Search */}
//                 <div className="flex justify-start gap-5   container  mb-10">
//                     <input
//                         type="search"
//                         placeholder="Search by discount id, min order, or status"
//                         className="w-96 border p-2  rounded-md "
//                     />
//                 </div>

//                 {/* Summary box */}
//                 <div className="flex gap-5 container mx-auto mb-10">
//                     <div
//                         onClick={() => handleFilterClick("all")}
//                         className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition
//                         ${activeFilter === "all" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}
//                     >
//                         <div className="flex items-center gap-3">
//                             <span className="w-8 h-8 bg-blue-300 rounded-full inline-block "></span>
//                             <span className="inline-block w-32">Total Discounts</span>
//                         </div>
//                         <span className="text-xl font-bold">{totalDiscounts}</span>
//                     </div>

//                     <div
//                         onClick={() => handleFilterClick(1)}
//                         className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-40 transition
//                         ${activeFilter === 1 ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}
//                     >
//                         <div className="flex items-center gap-3">
//                             <span className="w-8 h-8 bg-green-300 rounded-full inline-block "></span>
//                             <span>Responsed</span>
//                         </div>
//                         <span className="text-xl font-bold">{respondedCount}</span>
//                     </div>

//                     <div
//                         onClick={() => handleFilterClick(0)}
//                         className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-40 transition
//                         ${activeFilter === 0 ? "bg-yellow-100 border-yellow-500" : "hover:bg-gray-50"}`}
//                     >
//                         <div className="flex items-center gap-3">
//                             <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block "></span>
//                             <span>Pending</span>
//                         </div>
//                         <span className="text-xl font-bold">{pendingCount}</span>
//                     </div>
//                 </div>

//                 {/* --- TABLE --- */}
//                 <table className=" w-full container mx-auto my-10 text-lg">
//                     <thead >
//                         <tr className="text-left ">
//                             <th className=" border-b-2  border-gray-400 px-4 py-2"> Id</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">DiscountValue</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">StartDate</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">ExpiredDate</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">MinOrderAmount</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">MaxUsage</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">Status</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">CreatedDate</th>
//                             <th className="border-b-2  border-gray-400 px-4 py-2">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentDiscounts.map((discount, index) => {
//                             return (
//                                 <tr key={discount.id}>
//                                     <td className="px-4 py-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
//                                     <td className="px-4 py-2">
//                                         {discount.discountValue}
//                                     </td>
//                                     <td className="px-4 py-2">{discount.startDate}</td>
//                                     <td className="px-4 py-2">{discount.expiredDate}</td>
//                                     <td className="px-4 py-2">{discount.minOrderAmount}</td>
//                                     <td className="px-4 py-2">{discount.maxUsage}</td>
//                                     <td className="px-4 py-2">
//                                         <div
//                                             className={`font-semibold border rounded-md p-2 w-32 text-center
//               ${discount.status === 0
//                                                     ? "bg-yellow-100 text-yellow-700 border-yellow-400"
//                                                     : "bg-green-100 text-green-700 border-green-400"
//                                                 }`}
//                                         >
//                                             {(discount.status === 1) ? "Active" : "Inactive"}
//                                         </div>
//                                     </td>
//                                     <td className="px-4 py-2">{discount.createdDate}</td>
//                                     <td className="flex gap-5 px-4 py-2  ">
//                                         <div
//                                             className="!text-white bg-slate-700 p-2 px-4  rounded cursor-pointer "
//                                             onClick={() => setSelectedDiscountResponse(discount)}
//                                         >
//                                             Edit
//                                         </div>
//                                         <div className="bg-rose-400 p-2 px-4  rounded cursor-pointer !text-white">
//                                             Remove
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>

//                 <Pagination
//                     current={currentPage}                // Trang hiện tại
//                     pageSize={itemsPerPage}              // Số item mỗi trang
//                     total={currentDiscounts.length}      // Tổng item hiển thị (theo cách code ban đầu)
//                     showSizeChanger                      // Cho phép chọn số item/trang
//                     pageSizeOptions={[5, 10, 20, 50]}    // Tùy chọn số dòng mỗi trang
//                     onChange={(page, pageSize) => {
//                         setCurrentPage(page);
//                         setItemsPerPage(pageSize);
//                     }}
//                     className="text-center flex justify-end !text-lg"
//                     showTotal={(total) => `Total ${total} items`}
//                     showQuickJumper
//                 />

//                 {/* --- MODAL EDIT/RESPONSE --- */}
//                 {selectedDiscountResponse && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-40">
//                         <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 w-[420px]">
//                             <div className="mb-4 border-b pb-2">
//                                 <h2 className="text-xl font-bold">Edit Discount</h2>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Discount ID:{" "}
//                                     <span className="font-semibold text-blue-600">
//                                         #{selectedDiscountResponse.id}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium mb-1">Discount Value</label>
//                                 <input
//                                     type="text"
//                                     defaultValue={selectedDiscountResponse.discountValue as any}
//                                     className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium mb-1">Expired Date</label>
//                                 <input
//                                     type="text"
//                                     defaultValue={selectedDiscountResponse.expiredDate}
//                                     className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
//                                 />
//                             </div>

//                             <div className="flex justify-end gap-3 ">
//                                 <button className="px-5 py-2 bg-green-500 hover:bg-green-600 !text-white rounded-full shadow">
//                                     Save
//                                 </button>
//                                 <button
//                                     onClick={() => setSelectedDiscountResponse(null)}
//                                     className="px-5 py-2 bg-red-500 hover:bg-red-600 !text-white rounded-full shadow"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* --- MODAL VIEW --- */}
//                 {selectedDiscountView && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
//                         <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-6 w-[420px]">
//                             <div className="mb-4 border-b pb-2">
//                                 <h2 className="text-xl font-bold">View Discount</h2>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Discount ID:{" "}
//                                     <span className="font-semibold text-blue-600">
//                                         #{selectedDiscountView.id}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium mb-1">Discount Value</label>
//                                 <input
//                                     type="text"
//                                     value={selectedDiscountView.discountValue as any}
//                                     disabled
//                                     className="w-full p-2 rounded-md border border-gray-300 bg-gray-100"
//                                 />
//                             </div>

//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium mb-1">Expired Date</label>
//                                 <input
//                                     value={selectedDiscountView.expiredDate}
//                                     disabled
//                                     className="w-full h-32 p-2 rounded-md border border-gray-300 bg-gray-100"
//                                 />
//                             </div>

//                             <div className="flex justify-end">
//                                 <button
//                                     onClick={() => setSelectedDiscountView(null)}
//                                     className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </>
//         </>
//     )
// }
