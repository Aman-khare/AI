
import React, { useState, useRef, useEffect } from 'react';

const emergencyContacts = [
  { name: 'National Suicide Prevention Lifeline', number: '988' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
  { name: 'The Trevor Project (for LGBTQ youth)', number: '1-866-488-7386' },
  { name: 'General Emergency', number: '911' },
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
      <p className="mb-8 text-gray-400">If you are in immediate danger, please call 911. Here are some resources that can help.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white">Helplines</h3>
          <ul className="space-y-4">
            {emergencyContacts.map(contact => (
              <li key={contact.name} className="bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-lg text-gray-200">{contact.name}</p>
                <p className="text-blue-400 text-xl font-mono">{contact.number}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Camera */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-2xl font-semibold mb-4 text-white">Personal Safety Camera</h3>
          <p className="text-gray-400 mb-4 flex-grow">
            If you're in an uncomfortable situation, you can activate your camera. This does not record or transmit video, it only displays it on your screen for your personal use.
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

export default EmergencyView;
