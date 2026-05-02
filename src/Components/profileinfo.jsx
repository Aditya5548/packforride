"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  PhoneCall,
  User,
  Users,
  Calendar,
  X,
  Pencil,
  Loader2,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const ProfileInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setProfilepanel } = useUser();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("usertoken");
      const res = await axios.get("/api/user", { params: { token } });
      setData(res.data.user);
    } catch (error) {
      console.log("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closePopup = () => setProfilepanel(false);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
        <Icon size={12} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase text-gray-400">
          {label}
        </p>
        <p className="break-words text-[10px] font-semibold text-gray-700">
          {value || "Not added"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-3">
      <div
        className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        style={{
          width: "500px",
          maxWidth: "100%",
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-3">
          <h1 className="text-sm font-bold text-gray-800">Profile Detail</h1>

          <button
            onClick={closePopup}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
          >
            <X size={17} />
          </button>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="animate-spin text-red-500" size={28} />
          </div>
        ) : (
          <div className="p-5">
            <div className="mb-4 flex items-center gap-4 rounded-xl bg-red-50 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow">
                <User size={28} />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-base font-bold text-gray-800">
                  {data?.name || "User Name"}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={Calendar} label="Date of Birth" value={data?.dob} />
              <InfoRow icon={Users} label="Gender" value={data?.gender} />
              <InfoRow icon={PhoneCall} label="Phone" value={data?.phoneno} />
              <InfoRow icon={Mail} label="Email" value={data?.email} />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="rounded-xl border border-gray-300 px-5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-xs font-bold text-white hover:bg-red-600">
                <Pencil size={14} />
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;