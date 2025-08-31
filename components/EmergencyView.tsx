import React, { useState, useRef, useEffect } from 'react';

const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', number: '988' },
  { name: 'Emergency contact number', number: 'XXXXXXXXX' },
  { name: 'General Emergency', number: '108' },
];

const EmergencyView: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setShowCamera(false);
      streamRef.current = null;
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto text-gray-200">
      <h2 className="text-4xl font-bold mb-2 text-red-400">Emergency Support</h2>
      <p className="mb-8 text-gray-400">If you are in immediate danger, please call your local emergency number. Here are some resources that can help.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white">Helplines</h3>
          <ul className="space-y-4">
            {emergencyContacts.map(contact => (
              <li key={contact.name} className="bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-lg text-gray-200">{contact.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-blue-400 text-xl font-mono">{contact.number}</p>
                  <div className="flex space-x-4">
                    <PhoneIcon />
                    <VideoIcon />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Camera */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-2xl font-semibold mb-4 text-white">Personal Safety Camera</h3>
          <p className="text-gray-400 mb-4 flex-grow">
            If you uncomfortable in any situation, you can activate your camera. The AI will available for any emergency help .
          </p>
          <div className="w-full bg-black rounded-lg aspect-video mb-4 overflow-hidden">
            {showCamera && <video ref={videoRef} autoPlay className="w-full h-full object-cover" />}
          </div>
          <button
            onClick={showCamera ? stopCamera : startCamera}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
              showCamera ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {showCamera ? 'Deactivate Camera' : 'Activate Camera'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


export default EmergencyView;
