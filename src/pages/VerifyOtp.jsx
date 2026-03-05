import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const VerifyOtp = () => {
    const { axios, navigate } = useContext(AppContext);
    const [otp, setOtp] = useState("");
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const location = useLocation();

    const email = location.state?.email || localStorage.getItem("signupEmail");

    useEffect(() => {
        if (!email) {
            navigate("/signup");
            return;
        }

        const devOtp = localStorage.getItem("signupDevOtp");
        if (devOtp) {
            setOtp(devOtp);
            toast.success(`Dev OTP loaded: ${devOtp}`);
        }
    }, [email, navigate]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const submitOtpHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/user/verify-otp", {
                email,
                otp,
            });

            if (data.success) {
                toast.success("Email verified successfully");
                localStorage.removeItem("signupEmail");
                localStorage.removeItem("signupDevOtp");
                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired OTP");
        }
    };

    const resendOtpHandler = async () => {
        if (!email || cooldown > 0 || resending) return;
        try {
            setResending(true);
            const { data } = await axios.post("/api/user/resend-otp", { email });
            if (data.success) {
                toast.success(data.message || "OTP resent");
                if (data.devOtp) {
                    localStorage.setItem("signupDevOtp", data.devOtp);
                    setOtp(data.devOtp);
                    toast.success(`Dev OTP loaded: ${data.devOtp}`);
                }
                setCooldown(30);
            } else {
                toast.error(data.message || "Unable to resend OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>

                <p className="text-center text-gray-500 text-sm mb-6">
                    Enter the OTP sent to your email
                </p>
                <p className="text-center text-xs text-gray-500 mb-4 break-all">{email}</p>

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

                <button
                    type="button"
                    onClick={resendOtpHandler}
                    disabled={resending || cooldown > 0}
                    className="w-full mt-3 py-2 text-sm rounded-lg border border-indigo-200 text-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {resending
                        ? "Resending..."
                        : cooldown > 0
                            ? `Resend OTP in ${cooldown}s`
                            : "Resend OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;
