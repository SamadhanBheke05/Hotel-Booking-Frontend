import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const VerifyOtp = () => {
    const { axios, navigate } = useContext(AppContext);
    const [otp, setOtp] = useState("");

    const email = localStorage.getItem("signupEmail");

    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
    }, [email, navigate]);

    const submitOtpHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/user/verify-otp", {
                email,
                otp,
            });

            if (data.success) {
                toast.success("Email verified successfully 🎉");

                localStorage.removeItem("signupEmail");

                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Invalid or expired OTP");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-2">
                    Verify OTP
                </h2>

                <p className="text-center text-gray-500 text-sm mb-6">
                    Enter the OTP sent to your email
                </p>

                <form onSubmit={submitOtpHandler} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full py-3 px-4 border rounded-lg text-center tracking-widest text-lg"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-3 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
