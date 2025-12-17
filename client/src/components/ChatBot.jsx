import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recordedMedicines, setRecordedMedicines] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting();
      addMessage('bot', greeting);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    return `${greeting}! 👋 I'm your Healthcare AI Assistant. How can I help you today? I can assist with:\n\n• Booking appointments (Medicine & General)\n• Recording medicines you're taking\n• Medicine information & dosage\n• Health questions & symptoms\n• Emergency guidance\n• General healthcare advice\n\nTry saying "Record [medicine name]" to track your medications!`;
  };

  const recordMedicine = (medicineName, dosage = '', frequency = '') => {
    const newMedicine = {
      id: Date.now(),
      name: medicineName,
      dosage,
      frequency,
      timestamp: new Date().toLocaleString()
    };
    setRecordedMedicines(prev => [...prev, newMedicine]);
    return `✅ I've recorded "${medicineName}"${dosage ? ` (${dosage})` : ''}${frequency ? ` - ${frequency}` : ''} in your medicine list.\n\nYou can view all recorded medicines anytime by asking "show my medicines" or "list medicines".`;
  };

  const getAIResponse = async (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Symptom checker
    if (message.includes('symptom') || message.includes('check symptom') || message.includes('i have')) {
      const symptoms = extractSymptoms(message);
      if (symptoms.length > 0) {
        return suggestDoctor(symptoms);
      }
      return `I can help you check symptoms! 🤒\n\nPlease describe your symptoms. For example:\n• "I have fever and headache"\n• "Check symptoms: cough, chest pain"\n• "I'm experiencing nausea and dizziness"\n\nBased on your symptoms, I can suggest which doctor to consult.`;
    }
    
    // Doctor suggestion
    if (message.includes('doctor') && (message.includes('suggest') || message.includes('recommend') || message.includes('which'))) {
      const symptoms = extractSymptoms(message);
      return suggestDoctor(symptoms);
    }
    
    // Show recorded medicines
    if (message.includes('show my medicines') || message.includes('list medicines') || message.includes('my medicines') || message.includes('recorded medicines')) {
      if (recordedMedicines.length === 0) {
        return `📋 You haven't recorded any medicines yet.\n\nTo record a medicine, just tell me:\n• "Record [medicine name]"\n• "Add [medicine name]"\n• "I'm taking [medicine name]"\n\nExample: "Record Paracetamol 500mg twice daily"`;
      }
      let medicineList = '📋 **Your Recorded Medicines:**\n\n';
      recordedMedicines.forEach((med, idx) => {
        medicineList += `${idx + 1}. **${med.name}**\n`;
        if (med.dosage) medicineList += `   Dosage: ${med.dosage}\n`;
        if (med.frequency) medicineList += `   Frequency: ${med.frequency}\n`;
        medicineList += `   Recorded: ${med.timestamp}\n\n`;
      });
      return medicineList;
    }

    // Record medicine patterns - check for common phrases
    const recordKeywords = ['record', 'add', 'save', 'taking', 'i take', 'i\'m taking', 'prescribed'];
    const hasRecordKeyword = recordKeywords.some(keyword => message.includes(keyword));
    
    if (hasRecordKeyword && (message.includes('medicine') || message.includes('medication') || message.includes('pill') || message.includes('tablet'))) {
      // Extract medicine name - look for common medicine names or extract after keywords
      let medicineName = '';
      let dosage = '';
      
      // Try to extract after "record", "add", "taking", etc.
      for (const keyword of recordKeywords) {
        if (message.includes(keyword)) {
          const parts = message.split(keyword);
          if (parts.length > 1) {
            const afterKeyword = parts[1].trim();
            // Extract medicine name (first 2-3 words typically)
            const words = afterKeyword.split(/\s+/);
            medicineName = words.slice(0, 3).join(' ').replace(/^(medicine|medication|pill|tablet)\s+/i, '').trim();
            
            // Look for dosage patterns
            const dosageMatch = afterKeyword.match(/(\d+\s*(?:mg|ml|g|tablet|pill|capsule|dose)?)/i);
            if (dosageMatch) {
              dosage = dosageMatch[1];
            }
            
            // Look for frequency
            const frequencyMatch = afterKeyword.match(/(twice|once|thrice|daily|weekly|every\s+\d+\s+hours?)/i);
            if (frequencyMatch) {
              dosage += (dosage ? ' ' : '') + frequencyMatch[1];
            }
            
            break;
          }
        }
      }
      
      // Fallback: if no keyword found but user mentions medicine, try to extract
      if (!medicineName && (message.includes('medicine') || message.includes('medication'))) {
        const medicineMatch = message.match(/(?:medicine|medication)\s+([a-z0-9\s]+?)(?:\s|$)/i);
        if (medicineMatch) {
          medicineName = medicineMatch[1].trim();
        }
      }
      
      if (medicineName && medicineName.length > 2) {
        return recordMedicine(medicineName, dosage);
      }
    }

    // Medicine-related queries
    if (message.includes('medicine') || message.includes('medication') || message.includes('drug')) {
      return `I can help you with medicine information! 💊\n\nYou can:\n• Book medicine appointments through the Medicine Booking page\n• Record medicines you're taking (just say "Record [medicine name]")\n• Ask about specific medicines\n• Get dosage information\n• Learn about side effects\n\nWould you like to book a medicine appointment or record a medicine?`;
    }

    // Appointment booking
    if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
      return `Great! I can help you book an appointment! 📅\n\nWe have two types of bookings:\n\n1. **Medicine Booking** - For ointments and medications\n2. **Appointment Booking** - For health issues like fever, cough, etc.\n\nWhich type of appointment would you like to book?`;
    }

    // Fever queries
    if (message.includes('fever') || message.includes('temperature')) {
      return `Fever Information 🌡️\n\nFever is usually a sign that your body is fighting an infection. Here's what you should know:\n\n• Normal body temperature: 98.6°F (37°C)\n• Mild fever: 99-100.4°F\n• Moderate fever: 100.4-102.2°F\n• High fever: Above 102.2°F\n\n**When to see a doctor:**\n• Fever above 103°F\n• Fever lasting more than 3 days\n• Severe headache or rash\n• Difficulty breathing\n\nWould you like to book an appointment for fever treatment?`;
    }

    // Cough queries
    if (message.includes('cough')) {
      return `Cough Information 🤧\n\nCoughs can be caused by various factors:\n\n**Types:**\n• Dry cough (no mucus)\n• Wet cough (with phlegm)\n• Chronic cough (lasting 8+ weeks)\n\n**Common causes:**\n• Cold or flu\n• Allergies\n• Asthma\n• Acid reflux\n\n**When to see a doctor:**\n• Cough lasting more than 3 weeks\n• Blood in cough\n• Difficulty breathing\n• Chest pain\n\nWould you like to book an appointment for cough treatment?`;
    }

    // Emergency queries
    if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return `🚨 **EMERGENCY ALERT**\n\nIf you're experiencing a life-threatening emergency, please:\n\n1. Call emergency services immediately (911, 112, etc.)\n2. Use the Emergency Alert button in the navigation\n3. Go to the nearest emergency room\n\n**Signs of emergency:**\n• Chest pain\n• Difficulty breathing\n• Severe allergic reaction\n• Unconsciousness\n• Severe bleeding\n\nI can help you send an emergency alert through the app. Would you like me to guide you?`;
    }

    // Health questions
    if (message.includes('health') || message.includes('symptom') || message.includes('pain')) {
      return `I'm here to help with your health questions! 🏥\n\nHowever, I'm an AI assistant and cannot replace professional medical advice. For:\n\n• **Serious symptoms** - Please consult a doctor immediately\n• **Persistent issues** - Book an appointment\n• **General questions** - I can provide information\n\nWhat specific health concern would you like to discuss?`;
    }

    // Ointment queries
    if (message.includes('ointment') || message.includes('cream') || message.includes('topical')) {
      return `Ointment Information 💊\n\nWe offer various types of ointments:\n\n• **Antibiotic Ointments** - For bacterial infections\n• **Antifungal Ointments** - For fungal infections\n• **Steroid Ointments** - For inflammation\n• **Moisturizing Ointments** - For dry skin\n• **Other Specialized Ointments**\n\nYou can book an ointment appointment through the Medicine Booking page. Would you like to book one?`;
    }

    // General greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! 👋 ${getGreeting().split('!')[0]}! How can I assist you with your healthcare needs today?`;
    }

    // Thank you
    if (message.includes('thank') || message.includes('thanks')) {
      return `You're welcome! 😊 I'm always here to help. Is there anything else you'd like to know about your healthcare?`;
    }

    // Default intelligent response
    return generateIntelligentResponse(message);
  };

  const extractSymptoms = (message) => {
    const symptomKeywords = [
      'fever', 'headache', 'cough', 'cold', 'sore throat', 'chest pain',
      'stomach pain', 'nausea', 'vomiting', 'dizziness', 'fatigue',
      'joint pain', 'back pain', 'rash', 'itchy', 'swelling',
      'difficulty breathing', 'shortness of breath', 'wheezing',
      'diarrhea', 'constipation', 'bloating', 'heartburn',
      'eye pain', 'vision problems', 'ear pain', 'hearing loss',
      'tooth pain', 'gum bleeding', 'skin rash', 'acne',
      'anxiety', 'depression', 'insomnia', 'memory loss'
    ];
    
    const foundSymptoms = [];
    symptomKeywords.forEach(symptom => {
      if (message.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });
    
    return foundSymptoms;
  };

  const suggestDoctor = (symptoms) => {
    const doctorMapping = {
      'fever': 'General Physician or Internal Medicine',
      'headache': 'Neurologist or General Physician',
      'cough': 'Pulmonologist or General Physician',
      'chest pain': 'Cardiologist (URGENT)',
      'difficulty breathing': 'Pulmonologist (URGENT)',
      'stomach pain': 'Gastroenterologist',
      'nausea': 'Gastroenterologist or General Physician',
      'joint pain': 'Rheumatologist or Orthopedist',
      'back pain': 'Orthopedist or Neurologist',
      'rash': 'Dermatologist',
      'eye pain': 'Ophthalmologist',
      'tooth pain': 'Dentist',
      'anxiety': 'Psychiatrist or Psychologist',
      'skin rash': 'Dermatologist'
    };
    
    let suggestions = '👨‍⚕️ **Doctor Recommendation:**\n\n';
    
    if (symptoms.length === 0) {
      return `Please describe your symptoms so I can suggest the right doctor.\n\nCommon symptoms:\n• Fever, cough, cold\n• Headache, dizziness\n• Stomach pain, nausea\n• Joint pain, back pain\n• Skin issues, rashes\n• Eye or ear problems`;
    }
    
    const suggestedDoctors = new Set();
    symptoms.forEach(symptom => {
      const doctor = doctorMapping[symptom] || 'General Physician';
      suggestedDoctors.add(doctor);
    });
    
    suggestions += `Based on your symptoms: ${symptoms.join(', ')}\n\n`;
    suggestions += `**Recommended Doctor:** ${Array.from(suggestedDoctors).join(' or ')}\n\n`;
    
    if (symptoms.some(s => ['chest pain', 'difficulty breathing'].includes(s))) {
      suggestions += `⚠️ **URGENT:** Please seek immediate medical attention or visit emergency department.\n\n`;
    }
    
    suggestions += `Would you like to book an appointment with a ${Array.from(suggestedDoctors)[0]}?`;
    
    return suggestions;
  };

  const generateIntelligentResponse = (message) => {
    // Check for common healthcare keywords
    const healthcareKeywords = {
      'headache': 'Headaches can have various causes. If severe or persistent, please consult a doctor. Would you like to book an appointment?',
      'stomach': 'Stomach issues can range from mild to serious. If you experience severe pain, vomiting, or it persists, please see a doctor.',
      'cold': 'Common cold symptoms usually resolve in 7-10 days. Rest, fluids, and over-the-counter medications can help. If symptoms worsen, see a doctor.',
      'allergy': 'Allergies can cause various symptoms. If you experience severe reactions like difficulty breathing, seek immediate medical attention.',
      'sleep': 'Sleep issues can affect your health. Maintaining a regular sleep schedule and good sleep hygiene helps. For persistent issues, consult a doctor.',
      'diet': 'A balanced diet is important for health. Include fruits, vegetables, whole grains, and stay hydrated. For specific dietary needs, consult a nutritionist.',
      'exercise': 'Regular exercise is beneficial for health. Start slowly and gradually increase intensity. If you have health conditions, consult a doctor first.',
      'vaccine': 'Vaccines are important for preventing diseases. Consult with your healthcare provider about recommended vaccinations.',
      'blood pressure': 'Blood pressure should be monitored regularly. Normal range is typically 120/80 mmHg. For concerns, consult a doctor.',
      'diabetes': 'Diabetes requires proper management through diet, exercise, and medication. Regular monitoring and doctor visits are essential.',
      'covid': 'For COVID-19 concerns, follow local health guidelines, get vaccinated, and consult healthcare providers for symptoms.',
      'pregnancy': 'Pregnancy requires regular prenatal care. Consult with an obstetrician for proper guidance and monitoring.',
      'child': 'Children\'s health needs special attention. For any concerns about your child\'s health, consult a pediatrician.',
      'elderly': 'Elderly care requires regular health checkups and monitoring. Ensure proper medication management and regular doctor visits.'
    };

    for (const [keyword, response] of Object.entries(healthcareKeywords)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // General helpful response
    return `I understand you're asking about "${message}". As your healthcare assistant, I can help you with:\n\n• Booking appointments (Medicine or General)\n• Health information\n• Emergency guidance\n• Medicine queries\n\nCould you provide more details about what you need? Or would you like me to help you book an appointment?`;
  };

  const addMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    addMessage('user', userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      try {
        const response = await getAIResponse(userMessage);
        addMessage('bot', response);
      } catch (error) {
        addMessage('bot', 'I apologize, but I encountered an error. Please try again.');
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      'Book Medicine': 'I want to book a medicine appointment',
      'Book Appointment': 'I want to book a general appointment',
      'Emergency': 'I need emergency help',
      'Health Info': 'Tell me about general health information',
      'My Medicines': 'show my medicines'
    };
    
    if (action === 'My Medicines' && recordedMedicines.length === 0) {
      addMessage('user', 'show my medicines');
      setIsTyping(true);
      setTimeout(() => {
        addMessage('bot', `📋 You haven't recorded any medicines yet.\n\nTo record a medicine, just tell me:\n• "Record [medicine name]"\n• "Add [medicine name]"\n• "I'm taking [medicine name]"\n\nExample: "Record Paracetamol 500mg twice daily"`);
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    setInputMessage(quickMessages[action]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="chatbot-pulse"></span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <h3>Healthcare AI Assistant</h3>
                  <p className="chatbot-status">
                    <span className="status-dot"></span> Online
                  </p>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    {msg.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="message-time">{msg.timestamp}</span>
                </motion.div>
              ))}
              {isTyping && (
                <div className="message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-quick-actions">
              <button onClick={() => handleQuickAction('Book Medicine')}>
                💊 Medicine
              </button>
              <button onClick={() => handleQuickAction('Book Appointment')}>
                📅 Appointment
              </button>
              <button onClick={() => handleQuickAction('My Medicines')}>
                📋 My Medicines {recordedMedicines.length > 0 && `(${recordedMedicines.length})`}
              </button>
              <button onClick={() => handleQuickAction('Emergency')}>
                🚨 Emergency
              </button>
            </div>

            <form className="chatbot-input-form" onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="chatbot-input"
                disabled={isTyping}
              />
              <button type="submit" className="chatbot-send" disabled={isTyping || !inputMessage.trim()}>
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
