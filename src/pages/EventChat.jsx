import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "./../axios";
import toast from "react-hot-toast";
function EventChat() {
  const { id } = useParams();
  const eventId = id;
      const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
   const fetchEvent = async () => {
          setLoading(true);
          try {
              const response = await axios.get(`api/events/${id}`);
              setEvent(response.data.event);
           
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
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const fetchMessages = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if(!token){
        return;
      }
      const response = await axios.get(`api/events/${id}/chat`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setMessages(response.data.data);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Error fetching messages';
    //  toast.error(errorMessage);
    //  console.error("Error fetching messages:", error);
    } finally {
    //   setLoading(false);
    }
  }
  useEffect(() => {
    fetchMessages();
    }, [id]);
     useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    fetchEvent();  
    }, [id]);
  const handleSendMessage = async(e) => {
    e.preventDefault();
    if (newMessage.trim()) {
        const token = localStorage.getItem("token");
        if(!token) {
            toast.error("Please login to send messages");
            return;
            }
            try{
                const response = await axios.post(`api/events/${id}/send_chat`,{
                    message: newMessage
                },{
                    headers:{
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                toast.success(response.data.message);
                  setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage("");
            }catch(error){
 const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error logining';
          toast.error(errorMessage);
            }finally{

            }

    
    }
  };
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

  return (
    <div className="flex flex-col h-[90vh] bg-gray-100 border-solid border-1 w-[100%]">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Link to={'/events/'+id} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Event #{eventId} {event.title}</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: 'calc(90vh - 120px)' }} // Adjust height to account for header and input
      >
        {messages && messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.user === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              <p className="text-sm font-semibold">{message.user}</p>
              <p>{message.text}</p>
              <p className="text-xs text-white-400 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventChat;