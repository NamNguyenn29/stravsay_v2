'use client';
import { User } from "@/model/User";
import { getUsers } from "@/api/getUser";
import { useState, useEffect } from "react";
import { Pagination } from 'antd';
import { Modal, Box, Button } from "@mui/material";
export default function UserMangement() {
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        getUsers().then(setUsers);
    });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const totalUser = users.length;
    const activeCount = users.filter(u => u.isActive && !u.isActive).length;
    const inactiveUser = users.filter(u => !u.isActive && !u.isDeleted).length;
    const deletedCount = users.filter(u => !u.isActive && u.isDeleted).length;

    const getDisplayStatus = (user: User) => {
        if (user.isDeleted) return "Deleted";
        if (user.isActive) return "Active";
        return "Inactive";
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700 border-green-400";
            case "Inactive":
                return "bg-yellow-100 text-yellow-700 border-yellow-400";
            case "Deleted":
                return "bg-red-100 text-red-700 border-red-400";
            default:
                return "bg-gray-100 text-gray-700 border-gray-400";
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerpage, setItemsPerpage] = useState(5);

    const [activeFilter, setActiveFilter] = useState<"All" | "Active" | "Inactive" | "Deleted">("All");

    const indexOfLast = currentPage * itemsPerpage;
    const indexOfFirst = indexOfLast - itemsPerpage;

    const filteredByStatus = users.filter(user => {
        switch (activeFilter) {
            case "Active":
                return user.isActive && !user.isDeleted;
            case "Inactive":
                return !user.isActive && !user.isDeleted;
            case "Deleted":
                return user.isDeleted;
            default:
                return true;
        }
    })
    const currentUsers = filteredByStatus.slice(indexOfFirst, indexOfLast);

    const handleFilterClick = (filter: "All" | "Active" | "Inactive" | "Deleted") => {
        setActiveFilter(filter);
        setCurrentPage(1);
    }
    return (
        <>
            <div className="font-semibold text-lg">User Management</div>
            <div className="border borde-b-1 container mx-auto bg-black my-3"></div>
            {/* Search */}
            <div className="flex justify-start gap-5 pt-4 container mb-10">
                <input type="search"
                    placeholder="Search by id, name , emai, role"
                    className="w-96 border p-2"

                />
            </div>
            {/*Summary box*/}
            <div className="flex gap-5 container mb-10">
                <div onClick={() => handleFilterClick("All")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton ${activeFilter === "All" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-blue-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Total User</span>
                    </div>
                    <span className="text-xl font-bold">{totalUser}</span>
                </div>
                <div onClick={() => handleFilterClick("Active")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton ${activeFilter === "Active" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-green-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Active User</span>
                    </div>
                    <span className="text-xl font-bold">{activeCount}</span>
                </div>
                <div onClick={() => handleFilterClick("Inactive")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton ${activeFilter === "Inactive" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Inactive User</span>
                    </div>
                    <span className="text-xl font-bold">{inactiveUser}</span>
                </div>
                <div onClick={() => handleFilterClick("Deleted")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton ${activeFilter === "Deleted" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-rose-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Deletd User</span>
                    </div>
                    <span className="text-xl font-bold">{deletedCount}</span>
                </div>

            </div>
            <div className="container mx-auto my-10 bg-white rounded-xl shadow-lg  overflow-hidden">
                <table className="w-full textbase">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-left text-gray-700 text-lg font-semibold">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3">Name/ Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created Date</th>
                            <th className="px-6 py-3">Last login</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>

                    </thead>
                    <tbody className="devide-y devide-gray-200 !text-base ">
                        {currentUsers.map((user, index) => {
                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-3 ">{index + 1 + (currentPage - 1) * itemsPerpage}</td>
                                    <td className="px-6 py-3 ">
                                        <div className=" text-lg font-semibold">{user.fullName}</div>
                                        <div>{user.email}</div>
                                    </td>
                                    <td className="px-6 py-3 ">{user.roles.toString()}</td>
                                    <td className="px-6 py-3 ">
                                        <div className={`font-semibold border rounded-md p-3 w-24 text-center${getStatusStyles(getDisplayStatus(user))}`}>
                                            {getDisplayStatus(user)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 ">{user.createdDate}</td>
                                    <td className="px-6 py-3 "></td>
                                    <td className="px-6 py-3 flex gap-5">
                                        <div className="bg-emerald-400 hover:bg-emerald-600 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer">Edit</div>
                                        <div className="bg-rose-400 hover:bg-rose-600 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer">Remove</div>
                                        <div className="bg-slate-500 hover:bg-slate-800 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer " onClick={() => setSelectedUser(user)}>More Detail</div>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                current={currentPage}
                pageSize={itemsPerpage}
                total={users.length}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setItemsPerpage(pageSize);
                }}
                className="text-center flex justify-end !text-lg"
                showTotal={(total) => `Total ${total} items`}
                showQuickJumper
            />


            <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "rgb(100,116,139)",
                        borderRadius: 2,
                        width: 1400,
                        mx: "auto",
                        mt: 5,
                        maxHeight: "90vh",   // giới hạn chiều cao modal
                        overflowY: "auto",   // bật thanh cuộn dọc
                    }}
                >
                    {selectedUser && (
                        <div className="grid grid-cols-12 gap-10 text-xl">
                            <div className="rounded-lg col-span-5 bg-white p-10 h-100 flex gap-10 relative">
                                <span className="bg-[rgb(238,242,255)] h-15 w-15 rounded-full text-center text-xl/15">
                                    {selectedUser.fullName.substring(0, 2).toUpperCase()}
                                </span>
                                <span className="mt-4">
                                    <div className="font-bold">{selectedUser.fullName}</div>
                                    <div>{selectedUser.email}</div>
                                    <div className="mt-4 px-3 py-2 rounded-full bg-green-300 w-24 text-center">
                                        {selectedUser.status}
                                    </div>

                                </span>
                                <div className="absolute top-50">
                                    <div className="flex gap-20">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">User ID</div>
                                            <div className="mb-5"> {selectedUser.id}</div>
                                            <div className="font-semibold text-sky-700 mb-2">Last login</div>
                                            <div className="mb-5"> {selectedUser.id}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Created Date</div>
                                            <div className="mb-5"> {selectedUser.createdDate}</div>
                                            <div className="font-semibold text-sky-700 mb-2">Date of Birth</div>
                                            <div className="mb-5"> {selectedUser.dateOfBirth}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-7 bg-white p-10 h-100 text-xl rounded">

                                <div className="text-sky-700 font-semibold text-2xl ">Personal Information</div>
                                <div className="grid grid-cols-12 mt-10">
                                    <div className="col-span-4 ">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Full Name</div>
                                            <div className="mb-5" >{selectedUser.fullName}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 ">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Email</div>
                                            <div className="mb-5" >{selectedUser.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 ">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Phone</div>
                                            <div className="mb-5" >{selectedUser.phone}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-8 ">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Address</div>
                                            <div className="mb-5" >{ }</div>
                                        </div>
                                    </div>
                                    {/* <div className="col-span-4 ">
                                        <div>
                                            <div className="font-semibold text-sky-700 mb-2">Genders</div>
                                            <div className="mb-5" >{selectedUser.fullName}</div>
                                        </div>
                                    </div> */}

                                </div>
                            </div>
                            <div className=" col-start-6 col-span-7 bg-white p-10 h-60 text-xl rounded">b</div>
                        </div>
                    )}
                    <div className="flex justify-end mt-6">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setSelectedUser(null)}
                        >
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}