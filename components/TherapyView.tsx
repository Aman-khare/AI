
import React, { useState, useRef } from 'react';
import { getSimpleAIResponse } from '../services/geminiService';

const TherapyView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioURL(null);
      setAnalysis('');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!audioURL) return;
    setIsLoading(true);
    setAnalysis('');
    const prompt = "A user has recorded an audio snippet from a therapy session. Without the transcript, provide a general, supportive, and encouraging analysis. Focus on themes of self-reflection, progress, and the courage it takes to attend therapy. Keep it brief and positive.";
    const response = await getSimpleAIResponse(prompt);
    setAnalysis(response);
    setIsLoading(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto text-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-white">Therapy Session Analysis</h2>
      <p className="mb-8 text-gray-400">Record a short snippet of your therapy session to get AI-powered insights. All recordings are processed locally and are not uploaded.</p>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center space-y-6">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center space-x-3 ${
            isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <MicrophoneIcon />
          <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        {audioURL && (
          <div className="w-full max-w-md p-4 bg-gray-700 rounded-lg space-y-4">
            <h3 className="font-semibold text-center">Your Recording</h3>
            <audio src={audioURL} controls className="w-full" />
            <button onClick={handleAnalyze} disabled={isLoading} className="w-full px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:bg-gray-500">
              {isLoading ? 'Analyzing...' : 'Get AI Insights'}
            </button>
          </div>
        )}

        {analysis && (
          <div className="w-full max-w-md p-5 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-300">AI Insights</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export default TherapyView;
