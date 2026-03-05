import React, { useContext, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { axios, navigate } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    adminCode: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // 🔒 Password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") setPasswordError("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number"
      );
      return;
    }

    try {
      let response;
      try {
        response = await axios.post("/api/user/signup", formData);
      } catch (error) {
        // Fallback for deployments using pluralized route prefix.
        if (error.response?.status === 404) {
          response = await axios.post("/api/users/signup", formData);
        } else {
          throw error;
        }
      }

      const { data } = response;

      if (data.success) {
        if (data.otpSent === false) {
          toast.error(
            data.message || "OTP email failed, but you can still verify OTP."
          );
        } else {
          toast.success("OTP sent to your email");
        }

        // store email for OTP verification
        localStorage.setItem("signupEmail", formData.email);
        if (data.devOtp) {
          localStorage.setItem("signupDevOtp", data.devOtp);
        } else {
          localStorage.removeItem("signupDevOtp");
        }

        // go to OTP page
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Join us and start booking today
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-3 border rounded-lg"
              value={formData.name}
              onChange={onChangeHandler}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 border rounded-lg"
              value={formData.email}
              onChange={onChangeHandler}
            />
          </div>

          {/* Role */}
          <select
            name="role"
            required
            className="w-full py-3 px-3 border rounded-lg"
            value={formData.role}
            onChange={onChangeHandler}
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="user">User</option>
            <option value="owner">Admin</option>
          </select>

          {/* Admin Code - Only if Admin is selected */}
          {formData.role === "owner" && (
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="adminCode"
                required
                placeholder="Enter Admin Code"
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={formData.adminCode}
                onChange={onChangeHandler}
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 border rounded-lg"
              value={formData.password}
              onChange={onChangeHandler}
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
