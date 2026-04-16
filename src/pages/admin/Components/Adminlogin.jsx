import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const Adminlogin = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const logcode = async (e) => {
    e.preventDefault();

    if (!userid || !password) {
      toast.error("Enter user id and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get("/api/admin", {
        params: { userid, password },
      });

      if (response?.data?.success) {
        localStorage.setItem("token", response.data.authkey);
        toast.success("Login successful");
        window.location.reload();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="flex w-full md:w-1/2 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Admin Login
          </h2>
          <p className="text-xs text-gray-500 text-center mt-1 mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={logcode} className="space-y-5">

            {/* USERID */}
            <div>
              <label className="text-xs text-gray-600">User ID</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:border-blue-500">
                <User size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  placeholder="Enter user id"
                  className="w-full ml-2 text-sm outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-gray-600">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:border-blue-500">
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full ml-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium  transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6">
            Authorized access only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;