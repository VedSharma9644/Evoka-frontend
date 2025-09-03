import React, { useState } from "react";
import getTranslation from "./../languages";
import axios from "./../axios";
import { toast } from "react-hot-toast";

function ParticipateModal({ closeParticipate, event, language, fetchEvent }) {
    const [participants, setParticipants] = useState([{ name: '', email: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addParticipant = () => {
        setParticipants([...participants, { name: '', email: '' }]);
    };

    const removeParticipant = (index) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((_, i) => i !== index));
        }
    };

    const updateParticipant = (index, field, value) => {
        const updated = [...participants];
        updated[index][field] = value;
        setParticipants(updated);
    };

    const handleParticipate = async () => {
        // Validate participants
        const validParticipants = participants.filter(p => p.name.trim() !== '');
        if (validParticipants.length === 0) {
            toast.error(getTranslation(language, "event.Please add at least one participant"));
            return;
        }

        // Check for duplicate names
        const names = validParticipants.map(p => p.name.trim().toLowerCase());
        const uniqueNames = [...new Set(names)];
        if (names.length !== uniqueNames.length) {
            toast.error(getTranslation(language, "event.Participant names must be unique"));
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `api/events/${event.id}/participate`,
                { 
                    participants: validParticipants,
                    total_tickets: validParticipants.length,
                    total_amount: event.is_free ? 0 : (event.price * validParticipants.length),
                    currency: 'EUR',
                    event_id: event.id,
                    event_title: event.title,
                    user_id: localStorage.getItem('user_id'),
                    payment_method: 'paypal' // or whatever payment method you use
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (response.status === 200) {
                if (response.data.redirect && response.data.redirect !== "") {
                    window.location.href = response.data.redirect;
                    return;
                }
                toast.success(getTranslation(language, "event.Participation successful"));
            }
            console.log(response.data);
            fetchEvent();
            closeParticipate();
        } catch (error) {
            const errorMessage =
                error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : getTranslation(language, "event.Failed to participate event. Please try again.");
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }
  return (
    <div id="eventModal" className="fixed inset-0 bg-black/40 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 mx-4 relative max-h-[90vh] overflow-y-auto">
        
        <button onClick={closeParticipate} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{getTranslation(language,"event.Participate")}</h2>

        {/* Event Information */}
        <div className="space-y-3 text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg">
          <div><strong>{getTranslation(language,'event.Start Date')}:</strong> {event.start_date} {event.start_time}</div>
          <div><strong>{getTranslation(language,"event.Location")}:</strong> {event.address}</div>
          <div><strong>{getTranslation(language,"event.Price")}:</strong> {event.is_free ? 'Free' : `€${event.price}`}</div>
          <div className="text-sm text-gray-600">
            <strong>{getTranslation(language,"event.Total Cost")}:</strong> {event.is_free ? 'Free' : `€${(event.price * participants.filter(p => p.name.trim() !== '').length).toFixed(2)}`}
          </div>
        </div>

        {/* Participants Form */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{getTranslation(language,"event.Add Participants")}</h3>
          
          {participants.map((participant, index) => (
            <div key={index} className="flex gap-2 mb-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation(language,"event.Participant Name")} {index + 1}
                </label>
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  placeholder={getTranslation(language,"event.Enter participant name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation(language,"event.Email")} {index + 1} <span className="text-gray-500">({getTranslation(language,"event.Optional")})</span>
                </label>
                <input
                  type="email"
                  value={participant.email}
                  onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                  placeholder={getTranslation(language,"event.Enter email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {participants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  title={getTranslation(language,"event.Remove participant")}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addParticipant}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-blue-500 hover:text-blue-500 transition"
          >
            + {getTranslation(language,"event.Add Another Participant")}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">{getTranslation(language,"event.Booking Summary")}</h4>
          <div className="text-sm text-gray-700">
            <div>{getTranslation(language,"event.Total Participants")}: {participants.filter(p => p.name.trim() !== '').length}</div>
            <div>{getTranslation(language,"event.Tickets")}: {participants.filter(p => p.name.trim() !== '').length}</div>
            {!event.is_free && (
              <div className="font-semibold">
                {getTranslation(language,"event.Total Amount")}: €{(event.price * participants.filter(p => p.name.trim() !== '').length).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={closeParticipate}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            {getTranslation(language,"event.Cancel")}
          </button>
          <button
            onClick={handleParticipate}
            disabled={isSubmitting || participants.filter(p => p.name.trim() !== '').length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            {isSubmitting ? getTranslation(language,"event.Processing...") : getTranslation(language,"event.Book Tickets")}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ParticipateModal;