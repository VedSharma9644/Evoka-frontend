import React, { useState, useEffect, useRef } from "react";
import axios from "./../axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import getTranslation from '../languages';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
          An error occurred while loading the map. Please refresh the page or try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

function CreateEvent({language}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    isPublic: true,
    notificationEmail: "",
    address: "",
    isFree: true,
    price: "",
    maxParticipants: "",
    latitude: "",
    longitude: "",
  });
  const [images, setImages] = useState([]);
  const [document, setDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (field) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(
      (file) => file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    if (validImages.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...validImages]);
    toast.success("Images uploaded");
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setDocument(file);
      toast.success("Document uploaded");
    } else {
      toast.error("Document must be less than 10MB");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    images.forEach((image) => data.append("images[]", image));
    if (document) data.append("document", document);

    try {
        const token = localStorage.getItem('token');

      const response = await axios.post('api/create-event', data, {
        headers: { "Content-Type": "multipart/form-data" ,  Authorization:`Bearer ${token}`},
      });
      toast.success("Event created successfully!");
      navigate("/my-events");
      console.log(response.data);
    } catch (error) {
        const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Failed to create event. Please try again.';
      toast.error(errorMessage);
       console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Maps Places Autocomplete and Map
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      // Initialize Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["geocode"], // Allow cities, addresses, and other place types
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && place.geometry) {
          const location = place.geometry.location;
          setFormData((prev) => ({
            ...prev,
            address: place.formatted_address,
            latitude: location.lat().toString(),
            longitude: location.lng().toString(),
          }));
          if (markerRef.current && mapRef.current) {
            markerRef.current.setPosition(location);
            mapRef.current.setCenter(location);
            mapRef.current.setZoom(12); // Zoom to city level
          }
        } else {
          toast.error("Invalid address selected. Please try again.");
        }
      });

      // Initialize Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeControl: false,
      });

      const marker = new window.google.maps.Marker({
        map,
        draggable: true,
      });

      markerRef.current = marker;

      // Update lat/lng on marker drag or click
      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition(e.latLng);
        map.setCenter(e.latLng);
        map.setZoom(15); // Zoom to street level for precise location
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          map.setCenter(position);
          map.setZoom(15); // Zoom to street level for precise location
          setFormData((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
        }
      });

      // Update map center and marker when coordinates change
      if (formData.latitude && formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const position = { lat, lng };
          map.setCenter(position);
          map.setZoom(15);
          marker.setPosition(position);
        }
      }
    } else {
      console.error("Google Maps Places API not loaded");
      toast.error("Failed to load Google Maps. Please try again later.");
    }
  }, [formData.address, formData.latitude, formData.longitude]);

 return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-indigo-900 dark:text-indigo-100 mb-12 animate-fade-in">
            {getTranslation(language, 'event.Create Your Event')} 
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">{getTranslation(language, 'event.Basic Information')} </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, 'event.Event Title')} </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                    placeholder={getTranslation(language, "event.Enter event title")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, 'event.Event Category')}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                    required
                  >
                    <option value="">{getTranslation(language, "event.Select Category")}</option>
                    <option value="dinner">Dinner</option>
                    <option value="picnic">Picnic</option>
                    <option value="lunch">Lunch</option>
                    <option value="aperitif">Aperitif</option>
                    <option value="party">Party</option>
                    <option value="disco">Disco</option>
                    <option value="fair">Fair</option>
                    <option value="conference">{getTranslation(language, "event.Conference")}</option>
                    <option value="workshop">{getTranslation(language, "event.Workshop")}</option>
                    <option value="social">{getTranslation(language, "event.Social")}</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Description")}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                  placeholder={getTranslation(language, "event.Describe your event")}
                  rows="4"
                  required
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Event Period")}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{getTranslation(language, "event.Start Date")}</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-1 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{getTranslation(language, "event.Start Time")}</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="mt-1 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{getTranslation(language, "event.End Date")}</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="mt-1 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">{getTranslation(language, "event.End Time")}</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="mt-1 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Event Type")}</label>
                <button
                  type="button"
                  onClick={() => handleToggle("isPublic")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    formData.isPublic
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  {formData.isPublic ? getTranslation(language, "event.Public") : getTranslation(language, "event.Private")}
                </button>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Notification Email")}</label>
                <input
                  type="email"
                  name="notificationEmail"
                  value={formData.notificationEmail}
                  onChange={handleInputChange}
                  className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                  placeholder={getTranslation(language, "event.Enter notification email")}
                  required
                />
              </div>
            </div>

            {/* Location and Capacity Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">{getTranslation(language, "event.Location & Capacity")}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Address")}</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  ref={addressInputRef}
                  className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                  placeholder={getTranslation(language, "event.Enter city or address")}
                  required
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Mark Location")}</label>
                <div
                  ref={mapRef}
                  className="mt-2 w-full h-80 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm"
                ></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {getTranslation(language, "event.Select a city/address or click/drag the marker to set the exact event location.")}
                  {formData.latitude && formData.longitude && (
                    <span>
                      {" "}
                      {getTranslation(language, "event.Selected")} : ({formData.latitude}, {formData.longitude})
                    </span>
                  )}
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Participation")}</label>
                <button
                  type="button"
                  onClick={() => handleToggle("isFree")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    formData.isFree
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  {formData.isFree ? getTranslation(language, "event.Free") : getTranslation(language, "event.Paid")}
                </button>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Price")} (EUR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200 ${
                      formData.isFree ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    placeholder={getTranslation(language, "event.Enter price")}
                    min="0"
                    step="0.01"
                    disabled={formData.isFree}
                    required={!formData.isFree}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{getTranslation(language, "event.Maximum Participants")}</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="mt-2 p-4 w-full border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
                    placeholder={getTranslation(language, "event.Enter max participants")}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Event Images Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">{getTranslation(language, "event.Event Images")}</h2>
              <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-600 rounded-lg p-8 text-center bg-indigo-50 dark:bg-indigo-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Drag and drop images here or click to upload (Max: 5MB each)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mt-3 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 dark:file:bg-indigo-500 file:text-white hover:file:bg-indigo-700 dark:hover:file:bg-indigo-600"
                />
              </div>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Documentation Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-6">{getTranslation(language, "event.Additional Documentation")}</h2>
              <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-600 rounded-lg p-8 text-center bg-indigo-50 dark:bg-indigo-900/30">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload a PDF, DOCX, or TXT file (Max: 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleDocumentUpload}
                  className="mt-3 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 dark:file:bg-indigo-500 file:text-white hover:file:bg-indigo-700 dark:hover:file:bg-indigo-600"
                />
              </div>
              {document && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{getTranslation(language, "event.Uploaded")}: {document.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
                isSubmitting
                  ? "bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed"
                  : "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                  {getTranslation(language, "event.Creating")}...
                </>
              ) : (
                getTranslation(language, "event.Create Event")
              )}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
);
}

export default CreateEvent;