import React, { useState } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../config/api';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'react-toastify';

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening,setListening] = useState(false)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const startSound = new Audio(start)

  function speak(message, _retry = false) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    // Cancel any previous speech to avoid overlaps
    synth.cancel();

    const voices = synth.getVoices();

    // If voices not yet loaded, wait for onvoiceschanged once, then retry
    if (!voices || voices.length === 0) {
      if (_retry) return; // avoid infinite loop
      const prevHandler = synth.onvoiceschanged;
      synth.onvoiceschanged = () => {
        speak(message, true);
        // restore previous handler if any
        synth.onvoiceschanged = prevHandler;
      };
      return;
    }

    // Prefer Indian English, then Google English, then generic English
    let selectedVoice =
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en-in")) ||
      voices.find(v => /google.*english/i.test(v.name)) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en")) ||
      voices[0];

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = selectedVoice;
    utterance.rate = 0.95;  // slightly slower for clarity
    utterance.pitch = 1.0;  // natural pitch

    synth.speak(utterance);
  }

  const speechRecognitionSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const handleSearch = async () => {
    if (!speechRecognitionSupported) {
      toast.error("Voice search is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true)
    setErrorMessage("");
    startSound.play().catch(() => {});
    recognition.start();

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript, true);
    };

    recognition.onerror = (event) => {
      setListening(false);
      const message = event?.error === "not-allowed"
        ? "Microphone permission was denied."
        : "Voice search failed. Please try typing your query.";
      setErrorMessage(message);
      toast.error(message);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleRecommendation = async (query, isVoiceSearch = false) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      toast.error("Please enter what you want to learn.");
      return;
    }

    console.log("AI search triggered with query:", trimmedQuery, "isVoiceSearch:", isVoiceSearch);
    setLoading(true);
    setHasSearched(true);
    setErrorMessage("");

    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: trimmedQuery }, { withCredentials: true });
      const courses = Array.isArray(result.data) ? result.data : [];
      setRecommendations(courses);

      if (isVoiceSearch) {
        if(courses.length>0){
          speak("These are the top courses I found for you")
        }else{
          speak("No courses found")
        }
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message ?? "AI search failed. Please try again.";
      setRecommendations([]);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setListening(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        handleRecommendation(input, false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      
      {/* Search Container */}
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
        <FaArrowLeftLong  className='text-[black] w-[22px] h-[22px] cursor-pointer absolute' onClick={()=>navigate("/")}/>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
          <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
          Search with <span className='text-[#CB99C7]'>AI</span>
        </h1>

        <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full ">
          
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />

          <button
            onClick={() => handleRecommendation(input, false)}
            disabled={!input.trim() || loading}
            className="absolute right-14 sm:right-16 bg-white rounded-full"
          >
            <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
          </button>

          <button
            className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
            onClick={handleSearch}
            disabled={loading}
          >
            <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
            <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
            AI Search Results 
          </h2>
       

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : listening ? (
        <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening...</h1>
      ) : loading ? (
        <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Searching for the best matching courses...</h1>
      ) : errorMessage ? (
        <h1 className='text-center text-xl sm:text-2xl mt-10 text-red-300'>{errorMessage}</h1>
      ) : hasSearched ? (
        <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No courses found for that query.</h1>
      ) : (
        <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Ask about a topic like AI, MERN, Cloud, UI/UX, or Data Science.</h1>
      )}
    </div>
  );
}

export default SearchWithAi;
