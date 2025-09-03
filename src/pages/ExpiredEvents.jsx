import React, { useState, useEffect } from "react";
import axios from "./../axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import base_URL from "./../config";
import getTranslation from "./../languages";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

function ExpiredEvents({ language,expired }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
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
        const response = await axios.get("api/events?expired=true", {
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

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Filter by event name
    if (searchName) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by city
    if (searchCity) {
      filtered = filtered.filter((event) =>
        event.address.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

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
  }, [statusFilter, searchName, searchCity, useLocation, userLocation, events]);

  if (loading) {
    return (
      <div className="min-h-screen   flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-indigo-600"
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 dark:text-indigo-100 mb-12 animate-fade-in">
          {expired ? getTranslation(language, 'navbar.expiredEvents') : getTranslation(language, "event.All Events")}
        </h1>
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={getTranslation(language, "event.Search by event name")}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 w-full sm:w-64"
            />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={getTranslation(language, "event.Search by city")}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 w-full sm:w-64"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useLocation}
                onChange={(e) => setUseLocation(e.target.checked)}
                className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {getTranslation(language, "event.Within 50km of my location")}
              </span>
            </label>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 w-full sm:w-48"
          >
            <option value="all">{getTranslation(language, "event.All Statuses")}</option>
            <option value="approved">{getTranslation(language, "event.Upcoming")}</option>
            <option value="completed">{getTranslation(language, "event.Completed")}</option>
          </select>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {getTranslation(language, "event.No events found. Create a new event")}
            </p>
            <button
              onClick={() => navigate("/create-event")}
              className="py-4 px-6 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg transition-all duration-300"
            >
              {getTranslation(language, "event.Create Event")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-700 p-6 w-full max-w-sm h-[420px] flex flex-col justify-between transform hover:shadow-xl dark:hover:shadow-gray-600 transition-all duration-300"
              >
                {event.images && event.images.length > 0 ? (
                  <img
                    src={`${base_URL}/storage/${event.images[0]}`}
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2 line-clamp-2">
                    {event.title}
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="line-clamp-1">{event.address}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {event.start_date} {event.start_time}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      {getTranslation(language, "event.Participants")}: 0/{event.max_participants}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/events/${event.id}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                >
                  <span>{getTranslation(language, "event.View")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);
}

export default ExpiredEvents;