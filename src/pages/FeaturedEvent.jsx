import React, { useState, useEffect } from "react";
import axios from "./../axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import base_URL from "./../config";
import getTranslation from "./../languages";
import { MapPin, Calendar, Users, Star } from "lucide-react";

function FeaturedEvent({ language, expired }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Haversine formula to calculate distance between two coordinates (in kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("api/events?fetured=true", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data.events);
        setFilteredEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch events. Please try again."
        );
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (useLocation && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            toast.success("Location acquired successfully.");
          },
          (error) => {
            toast.error("Failed to get your location. Please enable location services.");
            setUseLocation(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
        setUseLocation(false);
      }
    }
  }, [useLocation]);

  useEffect(() => {
    let filtered = events;

    // Filter by 50km radius
    if (useLocation && userLocation) {
      filtered = filtered.filter((event) => {
        if (!event.latitude || !event.longitude) return false;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(event.latitude),
          parseFloat(event.longitude)
        );
        return distance <= 50;
      });
    }

    setFilteredEvents(filtered);
  }, [useLocation, userLocation, events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
          ></path>
        </svg>
      </div>
    );
  }

 return (
  <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-12">
        {expired ? getTranslation(language, 'navbar.FeaturedEvent') : getTranslation(language, "event.Fetured Events")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center col-span-full">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {getTranslation(language, "event.No events found. Create a new event")}
            </p>
            <button
              onClick={() => navigate("/create-event")}
              className="py-4 px-6 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
            >
              {getTranslation(language, "event.Create Event")}
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full flex flex-col transform hover:shadow-xl transition-all duration-300"
            >
              {event.images && event.images.length > 0 ? (
                <img
                  src={`${base_URL}/storage/${event.images[0]}`}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
              <div className="relative">
                {/* Badges */}
                <div className="absolute top-[-16px] left-4 flex gap-2">
                  <span className="bg-yellow-400 dark:bg-yellow-500 text-gray-800 dark:text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                    POPOLARE
                  </span>
                  <span className="bg-green-400 dark:bg-green-500 text-gray-800 dark:text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                    {event.is_free ? "GRATUITO" : "PAGATO"}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {event.title}
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 dark:text-yellow-300 fill-current" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {event.description || "No description available."}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="line-clamp-1">{event.address}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      {event.start_date} {event.start_time}
                    </p>
                  </div>
                  {/* Tags */}
                  <div className="flex gap-2 mt-3">
                    {/* {["Vita Notturna", "Musica"].map((tag, index) => ( */}
                      <span
                       
                        className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                      >
                       {String(event.category).charAt(0).toUpperCase() + String(event.category).slice(1)}
                      </span>
                     {/* ))} */}
                  </div>
                </div>
                <Link
                  to={`/events/${event.id}`}
                  className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
                >
                  {getTranslation(language, "event.View")}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default FeaturedEvent;