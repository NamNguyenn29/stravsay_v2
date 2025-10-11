"use client"
import TextField from "@mui/material/TextField";
import { useState } from "react";
export default function SupportRequest() {
    const [form, setForm] = useState({
        email: "",
        fullName: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        })
    }
    return (
        <>

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
                        <label htmlFor="name">Name</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="name" name="name" label="Enter your name" variant="outlined" value={form.fullName} onChange={handleChange} />
                        </div>
                        <label htmlFor="email">Email</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="email" name="email" label="Enter your email" variant="outlined" value={form.fullName} onChange={handleChange} />
                        </div>
                        <label htmlFor="message">Message</label>
                        <div className="mt-5 mb-5">
                            <TextField className="p-20 w-100 bg-white" id="message" rows={4} name="message" label="Message" variant="outlined" multiline value={form.fullName} onChange={handleChange} />
                        </div>
                        <div className="ml-70 p-3 cursor-pointer hover:bg-rose-500 text-center bg-amber-400 text-white font-semibold text-xl w-30 rounded-md" >Submit</div>

                    </div>
                </div>
            </div>

        </>
    )
}