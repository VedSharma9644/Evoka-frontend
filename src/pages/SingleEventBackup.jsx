import React, { use, useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "./../axios";
import toast from "react-hot-toast";
import { Calendar, MapPin, Clock, Users, Download, Star, MessageSquare, MessageCircle, Tag, PlusCircle } from 'lucide-react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import base_URL from "./../config";
import getTranslation from "../languages";
import ParticipateModal from "./../components/ParticipateModal";
import ShareSidebar from "./../components/ShareSidebar";
import EventChat from "./../pages/EventChat";

function SingleEvent({ language,isLoggedIn }) {
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
            if (!token) {
                return;
            }
            const response = await axios.get(`/api/events/${id}/my-ratings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRating(response.data.rating);
        } catch (error) {
            const errorMessage =
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : 'Error fetching ratings';
            toast.error(errorMessage);
            console.error("Error fetching ratings:", error);
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMyRatings(); 
    },[id]);
     const fetchEvent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`api/events/${id}`);
            setEvent(response.data.event);
            setComments(response.data.comments);
            setParticipation(response.data.participation);
            /*
participation:
 'user_id' => $d->user_id,
                'name' => $d->user->username,
                 'status' => $d->status,
                'time' => $d->created_at,
            */
        } catch (error) {
            const errorMessage =
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : 'Error fetching event';
            toast.error(errorMessage);
            console.error("Error fetching event:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = async () => {
        if(!isLoggedIn) {
            toast.error("Please log in to participate in the event");
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
toast.error("Please log in to rate the event");
                return;
            }
            await axios.post(`/api/events/${id}/rate`, { rating: newRating } ,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            toast.success("Rating submitted!");
        } catch (error) {
            const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error rating event';
          toast.error(errorMessage);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await axios.post(`/api/events/${id}/comments`, { comment },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setComments([...comments, { text: comment, created_at: new Date() }]);
            setComment("");
            toast.success("Comment posted!");
            fetchEvent();
        } catch (error) {
            const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error updating profile';
          toast.error(errorMessage);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    const getSliderSettings = (imageCount) => ({
        dots: true,
        infinite: imageCount > 2, // Disable infinite loop for 1 or 2 images
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: imageCount > 1, // Disable autoplay for single image
        autoplaySpeed: 3000, arrows: true,
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (!event) {
        return <div className="text-center text-2xl mt-10">{getTranslation(language,"event.Event not found")}</div>;
    }

    // Deduplicate images
    const uniqueImages = [...new Set(event.images || [])];

    // Google Map iframe URL using latitude and longitude
    const googleMapUrl = event.latitude && event.longitude
        ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyDEFWG5jYxYTXBouOr43vjV4Aj6WEOXBps&q=${event.latitude},${event.longitude}&zoom=15`
        : `https://www.google.com/maps/embed/v1/place?key=AIzaSyDEFWG5jYxYTXBouOr43vjV4Aj6WEOXBps&q=${encodeURIComponent(event.address)}&zoom=15`;

    // Google Calendar link
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

    
    return (
        
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {showParticipateModal?(<ParticipateModal closeParticipate={closeParticipate} event={event} language={language} fetchEvent={fetchEvent} />): null}
          <ShareSidebar/>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Slider, Rating, Comments */}
                    <div className="space-y-6">
                        {/* Image Slider */}
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            {uniqueImages.length > 0 ? (
                                <Slider {...getSliderSettings(uniqueImages.length)}>
                                    {uniqueImages.map((image, index) => (
                                        <div key={index}>
                                            <img
                                                src={`${base_URL}/storage/${image}`}
                                                alt={`${event.title} - ${index + 1}`}
                                                className="w-full h-80 object-cover"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No images available</span>
                                </div>
                            )}
                        </div>

                        {/* Rating Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">{getTranslation(language,"event.Rate This Event")}</h2>
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-8 h-8 cursor-pointer ${
                                            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                        }`}
                                        onClick={() => handleRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                <MessageSquare className="w-6 h-6 mr-2 text-blue-500" />
                                {getTranslation(language,"event.Comments")}
                            </h2>
                            <form onSubmit={handleCommentSubmit} className="mb-6">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Add your comment..."
                                ></textarea>
                                <button
                                    type="submit"
                                    className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    {getTranslation(language,"event.Post Comment")}
                                </button>
                            </form>
                            <div className="space-y-4">
                                {comments.map((c, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <p className="text-gray-700">{c.text}</p>
                                        <p className="text-sm text-gray-500">
                                        {getTranslation(language,"event.Posted on")} {new Date(c.created_at).toLocaleString()} By: {c.user_name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Event Details Card */}
                    <div className="space-y-6">
                        {/* Event Details */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <Tag className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{event.category}</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{getTranslation(language,"event.Participants")}: {event.participation_total}/{event.max_participants} </span>
                                </div>
                                {/* Participants List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          {getTranslation(language, "event.Participants")}
        </h2>
        {participation.length > 0 ? (
          <ul className="space-y-2">
            {participation.map((participant, index) => (
              <li key={index} className="flex items-center justify-between border-b py-2">
                <span className="text-gray-700">{participant.name}</span>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm ${
                      participant.status === "confirmed"
                        ? "text-green-500"
                        : participant.status === "pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(participant.time).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{getTranslation(language, "event.No participants yet")}</p>
        )}
      </div>


                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{event.start_time} - {event.end_time}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                                    <span>{event.address}</span>
                                </div>
                                  <div className="flex items-center">
                                     {getTranslation(language,"event.Organized By")}:
                                    <span> &nbsp; {event.user_name}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">{getTranslation(language,"event.Price")}:</span> {event.is_free ? 'Free' : `€${event.price}`}
                                </div>
                                <div>
                                    <span className="flex gap-1 mb-4">
                                        <span className="font-semibold">{getTranslation(language,"event.Rating")}:</span> 
                                        <div className="flex gap-1 mb-4 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 cursor-pointer ${
                                            star <= event.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                        }`}
                                       
                                    />
                                ))}
                            </div>
                                       
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">{event.description}</p>

                            {/* Google Map */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">{getTranslation(language,"event.Location")}</h2>
                                <iframe
                                    className="w-full h-64 rounded-lg"
                                    src={googleMapUrl}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Event Location"
                                ></iframe>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleParticipate}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    {getTranslation(language,"event.Participate")}
                                </button>
                                <Link
                                    to={`/events/${id}/chat`}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    {getTranslation(language,"event.Join Chat Group")}
                                </Link>
                                <a
                                    href={googleCalendarUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-300 flex items-center"
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    {getTranslation(language,"event.Add to Google Calendar")}
                                </a>
                                {event.document && (
                                    <a
                                        href={`${base_URL}/storage/${event.document}`}
                                        download
                                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        {getTranslation(language,"event.Download Document")}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
        <EventChat className="border-solid border-1" />

        </div>
    );
}

export default SingleEvent;