import React, { useState, useEffect, useRef } from "react";
import axios from "./../axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import base_URL from "./../config";
import getTranslation from '../languages';
import MyEventParticipantModal from './../components/MyEventParticipantModal';
 function EventModal({ event, onClose, onEdit,language }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && event.latitude && event.longitude) {
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
        });
        new window.google.maps.Marker({
          position: { lat, lng },
          map,
        });
      }
    }
  }, [event]);

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">{event.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{getTranslation(language,"event.Category")}:</span> {event.category}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Description")}:</span> {event.description}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Start")}:</span>{" "}
              {event.start_date} {event.start_time}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.End")}:</span>{" "}
              {event.end_date} {event.end_time}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Type")}:</span>{" "}
              {event.is_public ? getTranslation(language,"event.Public") : getTranslation(language,"event.Private")}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Notification Email")}:</span>{" "}
              {event.notification_email}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Address")}:</span> {event.address}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Participation")}:</span>{" "}
              {event.is_free ? getTranslation(language,"event.Free") : `${getTranslation(language,"event.Paid")} (€${event.price})`}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Max Participants")}:</span>{" "}
              {event.max_participants}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Coordinates")}:</span>{" "}
              {event.latitude && event.longitude
                ? `(${event.latitude}, ${event.longitude})`
                : "Not set"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">{getTranslation(language,"event.Status")}:</span> {getTranslation(language,"event."+event.status)}
            </p>
          </div>
          <div>
            {event.images && event.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">{getTranslation(language,"event.Images")}:</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {event.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${base_URL}/storage/${image}`}
                      alt={`Event ${index}`}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
            {event.document && (
              <p className="text-sm text-gray-600 mt-4">
                <span className="font-medium">{getTranslation(language,"event.Document")}:</span>{" "}
                <a
                  href={`${base_URL}/storage/${event.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {getTranslation(language,"event.View Document")}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-600">{getTranslation(language,"event.Location")}:</p>
          <div
            ref={mapRef}
            className="w-full h-64 border border-gray-200 rounded-xl shadow-sm mt-2"
          ></div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => {onEdit(event)
                 onClose() }
                }
            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200"
          >
           {getTranslation(language,"event.Edit")} 
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
          >
              {getTranslation(language,"event.Close")} 
          </button>
        </div>
      </div>
    </div>
  );
}

function EditEventModal({ event, onClose, onSave, language }) {
  const [formData, setFormData] = useState({
    title: event.title || "",
    category: event.category || "",
    description: event.description || "",
    startDate: event.start_date || "",
    startTime: event.start_time || "",
    endDate: event.end_date || "",
    endTime: event.end_time || "",
    isPublic: event.is_public || false,
    notificationEmail: event.notification_email || "",
    address: event.address || "",
    isFree: event.is_free || false,
    price: event.price || "",
    maxParticipants: event.max_participants || "",
    latitude: event.latitude || "",
    longitude: event.longitude || "",
  });
  const [images, setImages] = useState(event.images || []);
  const [newImages, setNewImages] = useState([]);
  const [document, setDocument] = useState(event.document || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (field) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validImages.length + images.length + newImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setNewImages([...newImages, ...validImages]);
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setImages(images.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
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

  const validateForm = () => {
    const requiredFields = [
      "title",
      "category",
      "description",
      "startDate",
      "startTime",
      "endDate",
      "endTime",
      "notificationEmail",
      "address",
      "maxParticipants",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`);
        return false;
      }
    }
    if (!formData.isFree && !formData.price) {
      toast.error("Please enter a price for a paid event.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }
    newImages.forEach((image) => data.append("images[]", image));
    if (document && typeof document !== "string") {
      data.append("document", document);
    }
    data.append("existing_images", JSON.stringify(images));

    // Log FormData for debugging
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axios.post(
        `api/events/${event.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      onSave(response.data.event);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : "Failed to update event.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["geocode"],
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
            mapRef.current.setZoom(12);
          }
        } else {
          toast.error("Invalid address selected.");
        }
      });

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: parseFloat(formData.latitude) || 0, lng: parseFloat(formData.longitude) || 0 },
        zoom: formData.latitude && formData.longitude ? 15 : 2,
        mapTypeControl: false,
      });

      const marker = new window.google.maps.Marker({
        map,
        draggable: true,
        position: formData.latitude && formData.longitude ? {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude),
        } : null,
      });

      markerRef.current = marker;

      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition(e.latLng);
        map.setCenter(e.latLng);
        map.setZoom(15);
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
          map.setZoom(15);
          setFormData((prev) => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
        }
      });
    } else {
      toast.error("Google Maps API not loaded.");
    }
  }, [formData.latitude, formData.longitude]);

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">  {getTranslation(language,"event.Edit Event")} </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{getTranslation(language,"event.Basic Information")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Event Title")}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                  placeholder={getTranslation(language,"event.Enter event title")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Event Category")}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                  required
                >
                  <option value="">{getTranslation(language,"event.Select Category")}</option>
                          <option value="dinner">Dinner</option>
                    <option value="picnic">Picnic</option>
                    <option value="lunch">Lunch</option>
                    <option value="aperitif">Aperitif</option>
                    <option value="party">Party</option>
                    <option value="disco">Disco</option>
                    <option value="fair">Fair</option>
                  <option value="conference">{getTranslation(language,"event.Conference")}</option>
                  <option value="workshop">{getTranslation(language,"event.Workshop")}</option>
                  <option value="social">{getTranslation(language,"event.Social")}</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Description")}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder={getTranslation(language,"event.Describe your event")}
                rows="4"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Event Period")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600">{getTranslation(language,"event.Start Date")}</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">{getTranslation(language,"event.Start Time")}</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">{getTranslation(language,"event.End Date")}</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">{getTranslation(language,"event.End Time")}</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">{getTranslation(language,"event.Event Type")}</label>
              <button
                type="button"
                onClick={() => handleToggle("isPublic")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  formData.isPublic
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {formData.isPublic ? getTranslation(language,"event.Public") : getTranslation(language,"event.Private")}
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
              {getTranslation(language,"event.Notification Email")}
              </label>
              <input
                type="email"
                name="notificationEmail"
                value={formData.notificationEmail}
                onChange={handleInputChange}
                className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder={getTranslation(language,"event.Enter notification email")}
                required
              />
            </div>
          </div>

          <div className="border p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{getTranslation(language,"event.Location & Capacity")}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Address")}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                ref={addressInputRef}
                className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder={getTranslation(language,"event.Enter address")}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Mark Location")}</label>
              <div
                ref={mapRef}
                className="mt-2 w-full h-80 border border-gray-200 rounded-xl shadow-sm"
              ></div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">{getTranslation(language,"event.Participation")}</label>
              <button
                type="button"
                onClick={() => handleToggle("isFree")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  formData.isFree
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {formData.isFree ? getTranslation(language,"event.Free") : getTranslation(language,"event.Paid")}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{getTranslation(language,"event.Price")} (EUR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200 ${
                    formData.isFree ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  placeholder={getTranslation(language,"event.Enter price")}
                  min="0"
                  step="0.01"
                  disabled={formData.isFree}
                  required={!formData.isFree}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                 {getTranslation(language, "event.Maximum Participants")}
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="mt-1 p-4 w-full border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
                  placeholder={getTranslation(language,"event.Enter max participants")}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{getTranslation(language,"event.Event Images")}</h3>
            <div className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center bg-indigo-50">
              <p className="text-sm text-gray-600">
                Drag and drop images here or click to upload (Max: 5MB each)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={`${base_URL}/storage/${image}`}
                    alt={`Existing ${index}`}
                    className="w-full h-16 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, true)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New ${index}`}
                    className="w-full h-16 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, false)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">{getTranslation(language,"event.Additional Documentation")}</h3>
            <div className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center bg-indigo-50">
              <p className="text-sm text-gray-600">
                Upload a PDF, DOCX, or TXT file (Max: 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleDocumentUpload}
                className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
            </div>
            {document && (
              <p className="mt-4 text-sm text-gray-600">
               {getTranslation(language,"event.Uploaded")} : {typeof document === "string" ? document.split("/").pop() : document.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300 ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
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
                  {getTranslation(language,"event.Saving")}...
                </>
              ) : (
                getTranslation(language,"event.Save Changes")
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-4 px-6 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              {getTranslation(language,"event.Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MyEvents({language}) {
  
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedParticipantsEvent, setSelectedParticipantsEvent] = useState(null);
  
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/my-events", {
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
  useEffect(() => {


    fetchEvents();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.status === statusFilter));
    }
  }, [statusFilter, events]);

  const handleSaveEvent = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setFilteredEvents(
      filteredEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    fetchEvents();
   

  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 dark:text-indigo-100 mb-12 animate-fade-in">
          {getTranslation(language, "event.My Events")}
        </h1>
        <div className="mb-8 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all duration-200"
          >
            <option value="all">{getTranslation(language, "event.All Statuses")}</option>
            <option value="pending">{getTranslation(language, "event.Pending")}</option>
            <option value="approved">{getTranslation(language, "event.Approved")}</option>
            <option value="completed">{getTranslation(language, "event.Completed")}</option>
            <option value="rejected">{getTranslation(language, "event.Rejected")}</option>
          </select>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6">{getTranslation(language, "event.No events found. Create your first event")}</p>
            <button
              onClick={() => navigate("/create-event")}
              className="py-4 px-6 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-lg transition-all duration-300"
            >
              {getTranslation(language, "event.Create Event")}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-700 p-8 transform hover:scale-[1.02] transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">{event.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{getTranslation(language, "event.Category")}:</span> {event.category}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="font-medium">{getTranslation(language, "event.Start")}:</span>{" "}
                      {event.start_date} {event.start_time}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span className="font-medium">{getTranslation(language, "event.Status")}:</span> {event.status}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-4">
                    {event.participants.length > 0 ? (
                      <button
                        onClick={() => setSelectedParticipantsEvent(event)}
                        className="py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                      >
                        {getTranslation(language, "event.Participants")} ({event.participants.length})
                      </button>
                    ) : null}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                    >
                      {getTranslation(language, "event.View More")}
                    </button>
                    <button
                      onClick={() => setEditEvent(event)}
                      className="py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
                    >
                      {getTranslation(language, "event.Edit")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={setEditEvent}
            language={language}
          />
        )}
        {editEvent && (
          <EditEventModal
            event={editEvent}
            onClose={() => setEditEvent(null)}
            onSave={handleSaveEvent}
            language={language}
          />
        )}
        {selectedParticipantsEvent && (
          <MyEventParticipantModal
            participants={selectedParticipantsEvent.participants}
            onClose={() => setSelectedParticipantsEvent(null)}
            id={selectedParticipantsEvent.id}
            fetchEvents={fetchEvents}
            language={language}
          />
        )}
      </div>
    </div>
);
}

export default MyEvents;