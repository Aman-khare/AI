
import React, { useState, useRef, useCallback } from 'react';
import { getSimpleAIResponse } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';

const TherapyView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleTranscriptReady = useCallback((text: string) => {
    setTranscript(prev => (prev ? `${prev} ${text}` : text).trim());
  }, []);

  const { startListening, stopListening } = useSpeech(handleTranscriptReady);

  const handleStartRecording = async () => {
    setError(null); // Reset error state on new attempt
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
      setTranscript(''); // Reset transcript
      startListening(); // Start speech recognition
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
         setError("Microphone permission denied. To use recording, please grant access in your browser's settings.");
      } else {
         setError("Could not access microphone. Please ensure it's connected and permissions are granted in your browser settings.");
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopListening(); // Stop speech recognition
    }
  };

  const handleAnalyze = async () => {
    if (!transcript) {
        alert("A transcript could not be generated from the audio. Please try recording again in a quieter environment.");
        return;
    }
    setIsLoading(true);
    setAnalysis('');
    const prompt = `A user has provided a transcript from their therapy session. Please analyze it. Identify key themes, emotions, and potential areas for reflection. Provide supportive and encouraging insights based on the text. Do not give medical advice. Keep the analysis compassionate and constructive, and format it with clear headings for different sections of the analysis. Here is the transcript:\n\n"${transcript}"`;
    const response = await getSimpleAIResponse(prompt);
    setAnalysis(response);
    setIsLoading(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto text-gray-200">
      <h2 className="text-4xl font-bold mb-6 text-white">Therapy Session Analysis</h2>
      <p className="mb-8 text-gray-400">Record a short snippet of your therapy session to get AI-powered insights. Your audio is processed in your browser to generate a transcript, which is then sent for analysis. The audio itself is never uploaded.</p>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center space-y-6">
        {error && (
            <div className="w-full max-w-md p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-center" role="alert">
                <p className="font-semibold">Microphone Error</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 flex items-center space-x-3 ${
            isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <MicrophoneIcon />
          <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
        </button>

        {audioURL && !error && (
          <div className="w-full max-w-md p-4 bg-gray-700 rounded-lg space-y-4">
            <h3 className="font-semibold text-center">Your Recording</h3>
            <audio src={audioURL} controls className="w-full" />

            {transcript ? (
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-300">Transcript</h4>
                    <div className="bg-gray-900 p-3 rounded-lg max-h-40 overflow-y-auto text-gray-400 text-sm">
                        {transcript}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-900 p-3 rounded-lg text-center text-gray-500 text-sm">
                    Generating transcript... if no speech was detected, this may remain empty.
                </div>
            )}
            
            <button 
              onClick={handleAnalyze} 
              disabled={isLoading || !transcript} 
              className="w-full px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
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
