import React, { useState, useEffect } from "react";
import axios from "./../axios";
import toast from "react-hot-toast";
import getTranslation from "./../languages";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';

function MyParticipation({ language }) {
    const [participations, setParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showETicket, setShowETicket] = useState(false);
    const [selectedParticipation, setSelectedParticipation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParticipations = async () => {
            try {
                setLoading(true);
                const response = await axios.get("api/my-participation", {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setParticipations(response.data.data);
            } catch (error) {
                const errorMessage =
                    error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : 'Failed to create event. Please try again.';
                toast.error(errorMessage);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipations();
    }, []);

    const handleShowETicket = (participation) => {
        setSelectedParticipation(participation);
        setShowETicket(true);
    };

    return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                {getTranslation(language, "event.My Participation")}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
                {getTranslation(language, "event.List of events I participated in")}.
            </p>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 dark:border-blue-400"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {getTranslation(language, "event.Event Name")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {getTranslation(language, "event.Date n Time")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {getTranslation(language, "event.Status")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {getTranslation(language, "event.Participated At")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {getTranslation(language, "event.ETicket")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {participations.map((participation) => (
                                <tr key={participation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                                        onClick={() => navigate('/events/' + participation.id)}
                                    >
                                        {participation.eventName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {participation.dateTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                participation.status === "Confirmed"
                                                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                                                    : participation.status === "Pending"
                                                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
                                                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                                            }`}
                                        >
                                            {participation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {participation.participatedAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <button
                                            onClick={() => handleShowETicket(participation)}
                                            className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                                        >
                                            View ETicket
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ETicket Modal */}
            {showETicket && selectedParticipation && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ETicket</h2>
                        <div className="mb-4">
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Event: {selectedParticipation.eventName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Participation ID: {selectedParticipation.id}</p>
                        </div>
                        <div className="flex justify-center mb-4">
                            <QRCodeCanvas
                                value={selectedParticipation.id}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                        <button
                            onClick={() => setShowETicket(false)}
                            className="w-full bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 text-center">
                <a
                    href="/"
                    className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-200"
                >
                    {getTranslation(language, "event.Go Back to Home")}
                </a>
            </div>
        </div>
    </div>
);
}

export default MyParticipation;