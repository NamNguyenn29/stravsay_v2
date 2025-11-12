'use client';
import { User } from "@/model/User";
import { getUsers } from "@/api/UserApi/getUser";
import { useState, useEffect, useCallback } from "react";
import { Button, message, Modal, Pagination } from 'antd';
import UserDetailModal from "@/components/admin/UserDetailModal";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { userService } from "@/services/userService";


export default function UserMangement() {
    const [users, setUsers] = useState<User[]>([]);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [keyword, setKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contextHolder] = message.useMessage();

    const loadUsers = useCallback(async () => {
        const data = await getUsers(currentPage, pageSize);
        setUsers(data.list);
        setTotalElement(data.totalElement)
    }, [currentPage, pageSize]);


    const searchUsers = useCallback(async (filter: string, page: number, size: number) => {
        const res = await userService.searchUser(filter, page, size);

        if (res.data.isSuccess) {
            setUsers(res.data.list);
            setTotalElement(res.data.totalElement);
        } else {
            messageApi.error(res.data.message);
        }
    }, [messageApi]);


    useEffect(() => {
        if (!isSearching) {
            loadUsers();
        } else {
            searchUsers(keyword, currentPage, pageSize);
        }
    }, [currentPage, pageSize, isSearching, loadUsers, searchUsers]);







    const getStatusStyles = (isActive: boolean) => {
        if (isActive) {

            return "bg-green-100 text-green-700 border-green-400";
        }
        else {
            return "bg-yellow-100 text-yellow-700 border-yellow-400";
        }
    }


    const handleDeleteUser = (id: string) => {
        modal.confirm({
            title: "Are you sure want to remove this user",
            content: "This action can not be undo",
            centered: true,
            okText: ("Yes, delete it "),
            cancelText: "Cancel",
            okType: "danger",
            className: "custom-delete-confirm",

            async onOk() {

                const res = await userService.deleteUser(id);
                if (res.data.isSuccess) {
                    messageApi.success(res.data.message);
                } else {
                    messageApi.error(res.data.message);
                }
                loadUsers();

            }

        })
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return dayjs(dateString).format("DD/MM/YYYY ");
    };

    const handleSearch = async () => {
        if (keyword.trim() === "") {
            setIsSearching(false);
            setCurrentPage(1);
            loadUsers();
            return;
        }

        setIsSearching(true);
        setCurrentPage(1);

        searchUsers(keyword, 1, pageSize);
    };





    return (
        <>
            {modalContextHolder}
            {contextHolder}
            <div className="font-semibold text-lg">User Management</div>
            <div className="border borde-b-1 container mx-auto bg-black my-3"></div>
            {/* Search */}
            <div className="flex justify-start gap-5 pt-4 container mb-10">
                <input type="search"
                    placeholder="Search by name , emai, phone, role"
                    className="w-96 border p-2"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}

                />
                <Button type="primary" icon={<SearchOutlined />} iconPosition={'start'} size="large" onClick={handleSearch}>
                    Search
                </Button>
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
                                        <div className={`ont-semibold border rounded-md p-3 w-24 text-center ${getStatusStyles(user.isActived)}`}>
                                            {user.isActived ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 ">{formatDate(user.createdDate)}</td>
                                    <td className="px-6 py-3 "></td>
                                    <td className="px-6 py-3 flex gap-5">
                                        <div className="bg-slate-500 hover:bg-slate-800 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer " onClick={() => setSelectedUser(user)}>More Detail</div>
                                        <div className="bg-rose-400 hover:bg-rose-600 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer" onClick={() => handleDeleteUser(user.id)}>Remove</div>

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