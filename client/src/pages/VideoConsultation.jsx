import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './VideoConsultation.css';

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const roomIdRef = useRef(null);

  useEffect(() => {
    fetchAppointment();
    return () => {
      endCall();
    };
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/appointments/${appointmentId}`);
      setAppointment(res.data);
      if (res.data.videoRoomId) {
        setRoomId(res.data.videoRoomId);
        roomIdRef.current = res.data.videoRoomId;
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
    }
  };

  // Define handlers with useCallback to ensure stable references for socket.off()
  const handleUserJoined = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer) {
      console.error('Peer connection not initialized');
      return;
    }
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      if (socket) {
        socket.emit('offer', { offer, roomId: roomIdRef.current });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [socket]);

  const handleOffer = useCallback(async ({ offer }) => {
    const peer = peerRef.current;
    if (!peer) {
      console.error('Peer connection not initialized');
      return;
    }
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      if (socket) {
        socket.emit('answer', { answer, roomId: roomIdRef.current });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [socket]);

  const handleAnswer = useCallback(async ({ answer }) => {
    const peer = peerRef.current;
    if (!peer) {
      console.error('Peer connection not initialized');
      return;
    }
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async ({ candidate }) => {
    const peer = peerRef.current;
    if (!peer) {
      console.error('Peer connection not initialized');
      return;
    }
    if (candidate) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Start video session
      const res = await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/video/start`);
      const currentRoomId = res.data.roomId;
      setRoomId(currentRoomId);
      roomIdRef.current = currentRoomId;
      
      // Initialize WebRTC peer connection
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerRef.current = peer;
      setIsConnected(true);
      
      // Start call duration timer
      const startTime = Date.now();
      intervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Join socket room
      if (socket) {
        socket.emit('join-video-room', currentRoomId);
        socket.on('user-joined', handleUserJoined);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
      }
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Failed to start video call. Please check your camera and microphone permissions.');
    }
  };


  const toggleMute = () => {
    if (streamRef.current) {
      const newMutedState = !isMuted;
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState; // Enable track when not muted
      });
      setIsMuted(newMutedState);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const newVideoOffState = !isVideoOff;
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !newVideoOffState; // Enable track when video is on
      });
      setIsVideoOff(newVideoOffState);
    }
  };

  const endCall = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      
      // Remove socket event listeners to prevent memory leaks
      if (socket) {
        socket.off('user-joined', handleUserJoined);
        socket.off('offer', handleOffer);
        socket.off('answer', handleAnswer);
        socket.off('ice-candidate', handleIceCandidate);
        socket.emit('leave-video-room', roomIdRef.current || roomId);
      }
      
      await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/video/end`);
      setIsConnected(false);
      navigate('/dashboard/appointments');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!appointment) {
    return <div className="loading">Loading appointment...</div>;
  }

  return (
    <div className="video-consultation">
      <div className="video-container">
        <div className="video-header">
          <h2>Video Consultation</h2>
          <div className="call-info">
            <span>Room: {roomId || 'Not started'}</span>
            {isConnected && <span>Duration: {formatDuration(callDuration)}</span>}
          </div>
        </div>

        <div className="video-grid">
          <div className="video-wrapper remote-video">
            <video ref={remoteVideoRef} autoPlay playsInline />
            {!isConnected && (
              <div className="video-placeholder">
                <p>Waiting for connection...</p>
              </div>
            )}
          </div>
          
          <div className="video-wrapper local-video">
            <video ref={localVideoRef} autoPlay playsInline muted />
            {isVideoOff && (
              <div className="video-overlay">
                <span>Video Off</span>
              </div>
            )}
          </div>
        </div>

        <div className="video-controls">
          {!isConnected ? (
            <button className="btn btn-primary" onClick={startCall}>
              Start Call
            </button>
          ) : (
            <>
              <button 
                className={`btn ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
                onClick={toggleMute}
              >
                {isMuted ? '🔇 Unmute' : '🔊 Mute'}
              </button>
              <button 
                className={`btn ${isVideoOff ? 'btn-danger' : 'btn-secondary'}`}
                onClick={toggleVideo}
              >
                {isVideoOff ? '📹 Turn On Video' : '📹 Turn Off Video'}
              </button>
              <button className="btn btn-danger" onClick={endCall}>
                End Call
              </button>
            </>
          )}
        </div>

        <div className="appointment-info">
          <h3>Appointment Details</h3>
          <p><strong>Patient:</strong> {appointment.patient?.name}</p>
          <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
          <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {appointment.appointmentTime}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;

