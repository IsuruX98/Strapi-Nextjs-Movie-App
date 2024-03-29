"use client";
import axiosInstance from "@/services/axiosConfig";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";

interface Film {
  id: number;
  attributes: {
    title: string;
    released: string;
    director: string;
    plot: { type: string; children: { type: string; text: string }[] }[];
    slug: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    reviews: {
      data: Review[];
    };
    poster: {
      data: {
        large: {
          url: string; // URL for the large poster image
          width: number;
          height: number;
        };
      };
    };
  };
}

interface Review {
  id: number;
  attributes: {
    review: string;
    reviewer: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

const SingleFilm = (params: any) => {
  const id = params.params.id;

  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState({
    value: "",
  });

  console.log(film);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axiosInstance.get(`/films/${id}/?populate=*`);
        setFilm(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching film");
        setLoading(false);
      }
    };
    if (id) {
      fetchFilm();
    }
  }, [id, review]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/reviews", {
        data: {
          review: review.value,
          reviewer: user?.username,
          film: film?.id,
        },
      });

      // Clear the review input field
      setReview({ value: "" });

      // Show success notification
      if (response) {
        toast.success("Review added successfully");
      }
    } catch (error) {
      console.error("error with request", error);
    }
  };

  if (loading) return <Loading />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!film) return <div>No film found</div>;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview({ value: e.target.value });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="px-20 py-8 bg-gray-900 lg:h-screen">
      <div className="bg-black bg-opacity-75 p-10 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-white">
          {film.attributes.title}
        </h1>
        <p className="text-gray-200 mb-2">
          Released: {film.attributes.released}
        </p>
        <p className="text-gray-200 mb-2">
          Director: {film.attributes.director}
        </p>
        <div className="text-gray-200 mb-4">
          Plot:{" "}
          {film.attributes.plot.map((paragraph, index) => (
            <p key={index}>{paragraph.children[0].text}</p>
          ))}
        </div>
        {/* Add Review Form */}
        {user ? (
          <div className="mb-8">
            <span className="block text-lg font-bold mb-2 text-white">
              Add Review
            </span>
            <form onSubmit={handleSubmit}>
              <textarea
                value={review.value}
                onChange={handleChange}
                placeholder="Add your review"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              ></textarea>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Add Review
              </button>
            </form>
            {/* Display Reviews */}
            <div className="mt-8">
              {film.attributes.reviews &&
              film.attributes.reviews.data.length > 0 ? (
                <>
                  <span className="block text-lg font-bold mb-2 text-white">
                    Reviews
                  </span>
                  {film.attributes.reviews.data.map((review: Review) => (
                    <div
                      key={review.id}
                      className="bg-white p-4 rounded-lg mb-4"
                    >
                      <p className="text-gray-800 mb-2">
                        <span className="font-semibold">Review:</span>{" "}
                        {review.attributes.review}
                      </p>
                      <p className="text-gray-800 mb-2">
                        <span className="font-semibold">Reviewer:</span>{" "}
                        {review.attributes.reviewer}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold"></span>
                        {formatDate(review.attributes.publishedAt)}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="mt-8 text-gray-200">No reviews available</div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SingleFilm;
