"use client"
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { notification } from "antd";
import { NewSupportRequest } from "@/model/NewSupportRequest";
import { useRouter } from "next/navigation";
import { CreateNewSupportRequest } from "@/api/Request/createRequest";
import { supportService } from "@/services/supportRequestService";
export default function SupportRequest() {
    const [form, setForm] = useState({
        email: "",
        sqtitle: "",
        sqdescription: "",
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.sqtitle || !form.sqdescription) {
            setError("Please fill in all required fields.");
            return;
        }



        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 800);

        try {
            const newSupportRequest: NewSupportRequest = {
                userEmail: form.email,
                title: form.sqtitle,
                description: form.sqdescription

            };

            // const res = await CreateNewSupportRequest(newSupportRequest);
            const res = await supportService.createSupportRequest(newSupportRequest);

            if (res.data.isSuccess) {
                api.success({
                    message: <span style={{ fontSize: '20px', fontWeight: '600' }}>Please check your email!</span>,
                    description: <span style={{ fontSize: '16px' }}>Create support request successfully</span>,
                    placement: "topRight",
                    duration: 15
                });

                await new Promise((resolve) => setTimeout(resolve, 1000));
                router.push("/");
            } else {
                setError(res.data.message || "Send support request failed.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            {contextHolder}
            <div className="text-center text-5xl text-white bg-black font-semibold  p-10">Support Request</div>
            <div className="container mx-auto my-30 px-20">
                <div className="text-5xl text-blue-900 font-semibold mb-10">WE ARE HERE FOR YOU</div>
                <div className="text-2xl">At STRAVSTAY, we take our customers seriously. Do you have any enquiries, compaints or requests,
                    please forward it to our support desk and we will get back to you as soon as possible.</div>
                <div className="grid grid-cols-12 mt-10">
                    <div className="col-span-6 text-xl text-sky-950">
                        <div className="mb-3">123 My Phuoc Tan Van, Chanh Hiep, Ho Chi Minh</div>
                        <div className="mb-3">Phone: 0123456789</div>
                        <div>Email : travstay@gmail.com</div>
                    </div>
                    <div className="col-span-6">
                        {error && <div className="text-red-500 mb-3">{error}</div>}
                        <label htmlFor="name">Title</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="sqtitle" name="sqtitle" label="Enter request title" variant="outlined" value={form.sqtitle} onChange={handleChange} />
                        </div>
                        <label htmlFor="email">Email</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="email" name="email" label="Enter your email" variant="outlined" value={form.email} onChange={handleChange} />
                        </div>
                        <label htmlFor="message">Message</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="sqdescription" rows={4} name="sqdescription" label="Description" variant="outlined" multiline value={form.sqdescription} onChange={handleChange} />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`ml-[70px] p-3 cursor-pointer hover:bg-rose-500 text-center bg-amber-400 text-white font-semibold text-xl w-32 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>


                    </div>
                </div>
            </div>

        </>
    )
}