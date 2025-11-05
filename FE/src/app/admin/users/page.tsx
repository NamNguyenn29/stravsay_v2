'use client';
import { User } from "@/model/User";
import { getUsers } from "@/api/UserApi/getUser";
import { useState, useEffect, use } from "react";
import { Pagination } from 'antd';
import UserDetailModal from "@/components/admin/UserDetailModal";
import dayjs from "dayjs";


export default function UserMangement() {
    const [users, setUsers] = useState<User[]>([]);
    const [totalPage, setTotalPage] = useState(1);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    useEffect(() => {
        loadUsers();
    }, [currentPage, pageSize]);

    const loadUsers = async () => {
        const data = await getUsers(currentPage, pageSize);
        setUsers(data.list);

        setTotalPage(data.totalPage ? data.totalPage : 0);
        setTotalElement(data.totalElement)
    };


    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const getStatusStyles = (isActive: boolean) => {
        if (isActive) {

            return "bg-green-100 text-green-700 border-green-400";
        }
        else {
            return "bg-yellow-100 text-yellow-700 border-yellow-400";
        }
    }




    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return dayjs(dateString).format("DD/MM/YYYY "); //
    };





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
                <div
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton  "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-blue-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Total User</span>
                    </div>
                    <span className="text-xl font-bold">{totalElement}</span>
                </div>
                <div
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton  "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-green-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Active User</span>
                    </div>
                    <span className="text-xl font-bold">10</span>
                </div>
                <div
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transtiton  "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3 ">
                        <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Inactive User</span>
                    </div>
                    <span className="text-xl font-bold">{10}</span>
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
                        {users.map((user, index) => {
                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-3 ">{index + 1 + (currentPage - 1) * pageSize}</td>
                                    <td className="px-6 py-3 ">
                                        <div className=" text-lg font-semibold">{user.fullName}</div>
                                        <div>{user.email}</div>
                                    </td>
                                    <td className="px-6 py-3 ">{user.roleList.toString()}</td>
                                    <td className="px-6 py-3 ">
                                        <div className={`ont-semibold border rounded-md p-3 w-24 text-center ${getStatusStyles(user.isActive)}`}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 ">{formatDate(user.createdDate)}</td>
                                    <td className="px-6 py-3 "></td>
                                    <td className="px-6 py-3 flex gap-5">
                                        <div className="bg-slate-500 hover:bg-slate-800 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer " onClick={() => setSelectedUser(user)}>More Detail</div>
                                        <div className="bg-rose-400 hover:bg-rose-600 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer">Remove</div>

                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalElement}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                }}
                className="text-center flex justify-end !text-lg"
                showTotal={(total) => `Total ${total} items`}
                showQuickJumper
            />
            <UserDetailModal
                selectedUser={selectedUser}
                onClose={() => setSelectedUser(null)}
                onUpdated={loadUsers}
            />


        </>
    )
}