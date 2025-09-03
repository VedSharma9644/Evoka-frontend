import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "./../axios";
import toast from "react-hot-toast";
import { Calendar, MapPin, Clock, Users, PlusCircle, Star, MessageSquare } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import base_URL from "./../config";
import getTranslation from "../languages";
import ParticipateModal from "./../components/ParticipateModal";
import ShareSidebar from "./../components/ShareSidebar";
import EventChat from "./../pages/EventChat";

function SingleEvent({ language, isLoggedIn }) {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [participation, setParticipation] = useState([]);
    const [showParticipateModal, setShowParticipateModal] = useState(false);

    const fetchMyRatings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await axios.get(`/api/events/${id}/my-ratings`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRating(response.data.rating);
        } catch (error) {
            const errorMessage = error.response?.data?.message || getTranslation(language, "event.Error fetching ratings");
            toast.error(errorMessage);
            console.error("Error fetching ratings:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`api/events/${id}`);
            setEvent(response.data.event);
            setComments(response.data.comments);
            setParticipation(response.data.participation);
        } catch (error) {
            const errorMessage = error.response?.data?.message || getTranslation(language, "event.Error fetching event");
            toast.error(errorMessage);
            console.error("Error fetching event:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = async () => {
        if (!isLoggedIn) {
            toast.error(getTranslation(language, "event.Please log in to participate in the event"));
            return;
        }
        setShowParticipateModal(true);
    };

    const closeParticipate = async () => {
        setShowParticipateModal(false);
    };

    const handleRating = async (newRating) => {
        setRating(newRating);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error(getTranslation(language, "event.Please log in to rate the event"));
                return;
            }
            await axios.post(`/api/events/${id}/rate`, { rating: newRating }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(getTranslation(language, "event.Rating submitted"));
        } catch (error) {
            const errorMessage = error.response?.data?.message || getTranslation(language, "event.Error rating event");
            toast.error(errorMessage);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await axios.post(`/api/events/${id}/comments`, { comment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setComments([...comments, { text: comment, created_at: new Date() }]);
            setComment("");
            toast.success(getTranslation(language, "event.Comment posted"));
            fetchEvent();
        } catch (error) {
            const errorMessage = error.response?.data?.message || getTranslation(language, "event.Error updating profile");
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        fetchMyRatings();
        fetchEvent();
    }, [id]);

    const getSliderSettings = (imageCount) => ({
        dots: true,
        infinite: imageCount > 2,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: imageCount > 1,
        autoplaySpeed: 3000,
        arrows: true,
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (!event) {
        return <div className="text-center text-2xl mt-10">{getTranslation(language, "event.Event not found")}</div>;
    }

    const uniqueImages = [...new Set(event.images || [])];
    const googleMapUrl = event.latitude && event.longitude
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDEFWG5jYxYTXBouOr43vjV4Aj6WEOXBps&q=${event.latitude},${event.longitude}&zoom=15`
        : `https://www.google.com/maps/embed/v1/place?key=AIzaSyDEFWG5jYxYTXBouOr43vjV4Aj6WEOXBps&q=${encodeURIComponent(event.address)}&zoom=15`;

    const googleCalendarUrl = () => {
        const startDateTime = new Date(`${event.start_date}T${event.start_time}`)
            .toISOString()
            .replace(/-/g, '')
            .replace(/:/g, '')
            .split('.')[0] + 'Z';
        const endDateTime = new Date(`${event.end_date}T${event.end_time}`)
            .toISOString()
            .replace(/-/g, '')
            .replace(/:/g, '')
            .split('.')[0] + 'Z';
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.address);
        const title = encodeURIComponent(event.title);
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}&sf=true&output=xml`;
    };

    const appleCalendarUrl = () => {
        const startDateTime = new Date(`${event.start_date}T${event.start_time}`)
            .toISOString()
            .replace(/-/g, '')
            .replace(/:/g, '')
            .split('.')[0];
        const endDateTime = new Date(`${event.end_date}T${event.end_time}`)
            .toISOString()
            .replace(/-/g, '')
            .replace(/:/g, '')
            .split('.')[0];
        const title = encodeURIComponent(event.title);
        const location = encodeURIComponent(event.address);
      //  const details = encodeURIComponent(event.description.replace(/\s+/g, ' ').trim());
      const details = "Event on evoka.info"

        return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${startDateTime}\nDTEND:${endDateTime}\nLOCATION:${location}\nDESCRIPTION:${details}\nEND:VEVENT\nEND:VCALENDAR`;
    };

    return (
  <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    {showParticipateModal && (
      <ParticipateModal
        closeParticipate={closeParticipate}
        event={event}
        language={language}
        fetchEvent={fetchEvent}
      />
    )}
    <ShareSidebar />
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Image, Title, Description, Date, Time, Location, Map, Rating, Comments */}
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            {uniqueImages.length > 0 ? (
              <Slider {...getSliderSettings(uniqueImages.length)}>
                {uniqueImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${base_URL}/storage/${image}`}
                      alt={`${event.title} - ${index + 1}`}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 dark:text-gray-400">{getTranslation(language, "event.No images available")}</span>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{event.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{event.description}</p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
              <span>{new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Clock className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
              <span>{event.start_time} - {event.end_time}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
              <span>{event.address}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <Users className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
              <span>{getTranslation(language, "event.Participants")}: {event.participation_total}/{event.max_participants}</span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{getTranslation(language, "event.Location")}</h2>
              <iframe
                className="w-full h-48 rounded-lg"
                src={googleMapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location"
              ></iframe>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{event.address}</p>
            </div>

            {/* Rating Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{getTranslation(language, "event.Rate This Event")}</h2>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating ? 'text-yellow-400 dark:text-yellow-300 fill-yellow-400 dark:fill-yellow-300' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                {getTranslation(language, "event.Comments")}
              </h2>
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  rows="4"
                  placeholder={getTranslation(language, "event.Add your comment")}
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 dark:bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300"
                >
                  {getTranslation(language, "event.Post Comment")}
                </button>
              </form>
              <div className="space-y-4">
                {comments.map((c, index) => (
                  <div key={index} className="border-b border-gray-300 dark:border-gray-600 pb-4">
                    <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTranslation(language, "event.Posted on")} {new Date(c.created_at).toLocaleString()} By: {c.user_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Event Details Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{getTranslation(language, "event.Event Details")}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="font-semibold mr-2">{getTranslation(language, "event.Category")}:</span>
                <span>{event.category}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="font-semibold mr-2">{getTranslation(language, "event.Type")}:</span>
                <span>{event.is_free ? getTranslation(language, "event.Free") : `€${event.price}`}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="font-semibold mr-2">{getTranslation(language, "event.Organized By")}:</span>
                <span>{event.user_name}</span>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleParticipate}
                  className={`w-full py-2 rounded-lg text-center ${
                    participation.some(p => p.user_id === localStorage.getItem("user_id") && p.status === "confirmed")
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-blue-500 dark:bg-blue-400 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
                  } transition duration-300`}
                >
                  {participation.some(p => p.user_id === localStorage.getItem("user_id") && p.status === "confirmed")
                    ? getTranslation(language, "event.Already participated")
                    : getTranslation(language, "event.Participate")}
                </button>
              </div>
              <div className="flex gap-2 mt-4">
                <a
                  href={googleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                  Google Calendar
                </a>
                <a
                  href={appleCalendarUrl()}
                  download={`${event.title}.ics`}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300" />
                  Apple Calendar
                </a>
              </div>
              {event.document?(<>
              <a href={`${base_URL}/storage/${event.document}`}
   download 
   class="inline-flex items-center w-[100%] text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300">
   📄 {getTranslation(language,"event.Additional Documentation")}
</a></>):''}

            </div>
          </div>

          {/* Participants Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
              {getTranslation(language, "event.Participants")}
            </h2>
            {participation.length > 0 ? (
              <ul className="space-y-2">
                {participation.map((participant, index) => (
                  <li key={index} className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500 dark:bg-purple-400 text-white flex items-center justify-center mr-2">
                        {participant.name[0]}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{participant.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(participant.time).toLocaleDateString()} {new Date(participant.time).toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{getTranslation(language, "event.No participants yet")}</p>
            )}
          </div>
          <EventChat className="border-solid border border-gray-300 dark:border-gray-600" />
        </div>
      </div>
    </div>
    <br />
    <br />
  </div>
);
}

export default SingleEvent;