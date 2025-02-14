import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../services/auth";

const VerifyEmail = () => {
  const { verificationToken } = useParams(); 
  const dispatch = useDispatch();

  const [status, setStatus] = useState("processing"); // processing, verified, failed

  useEffect(() => {
    if (status === "verified" || status === "failed") return;

    const verifyUserEmail = async () => {
      if (verificationToken) {
        console.log("verificationToken in params", verificationToken)
        try {
          const resultAction = await dispatch(verifyEmail({ verificationToken }));
          if (verifyEmail.fulfilled.match(resultAction)) {
            setStatus("verified");
          } else {
            setStatus("failed");
          }
        } catch (error) {
          setStatus("failed");
        }
      }
    };

    verifyUserEmail();
  }, [verificationToken, dispatch, status]); 

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Email
        </h2>

        {status === "processing" && (
          <div className="text-center text-gray-600">
            <p className="text-lg">Your email verification is in process...</p>
            <div className="mt-4">
              <svg
                className="animate-spin h-10 w-10 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm0 0h8V4a8 8 0 0 0-8 8Z"
                />
              </svg>
            </div>
          </div>
        )}

        {status === "verified" && (
          <div className="text-center text-green-500">
            <p className="text-lg font-semibold">Your email has been successfully verified!</p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Link expired or invalid. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
