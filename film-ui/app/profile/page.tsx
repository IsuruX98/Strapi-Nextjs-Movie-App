"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import axiosInstance from "@/services/axiosConfig";

const Profile = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/Users/me?populate=*`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="px-20 py-10 bg-gray-900 text-white h-screen">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {data && data.pic && (
            <div className="pt-6">
              <img
                src={`http://localhost:1337${data.pic.formats.medium.url}`}
                alt="Profile Picture"
                className="rounded-xl"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
