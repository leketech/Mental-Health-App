import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const TherapyBooking = () => {
  const { classes } = useTheme();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(0); // January 2025
  const [currentYear, setCurrentYear] = useState(2025);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const therapists = [
    {
      id: 1,
      name: 'Dr. Amelia Carter',
      specialization: 'Anxiety and Depression',
      rating: 4.9,
      experience: '8 years'
    },
    {
      id: 2,
      name: 'Dr. Ethan Bennett',
      specialization: 'Relationship Issues',
      rating: 4.8,
      experience: '6 years'
    },
    {
      id: 3,
      name: 'Dr. Sophia Clark',
      specialization: 'Stress Management',
      rating: 4.9,
      experience: '10 years'
    }
  ];

  const generateCalendar = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate({ day, month: currentMonth, year: currentYear });
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < 2030) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > 2025) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleBooking = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const isDateSelected = (day) => {
    return selectedDate && 
           selectedDate.day === day && 
           selectedDate.month === currentMonth && 
           selectedDate.year === currentYear;
  };

  const isPastDate = (day) => {
    const today = new Date();
    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate < today;
  };

  return (
    <div className={`min-h-screen ${classes.bgPrimary} ${classes.transition}`}>
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${classes.card} max-w-md w-full p-8 text-center`}>
            <div className="text-6xl mb-4">🕰️</div>
            <h3 className={`text-2xl font-bold ${classes.textPrimary} mb-4`}>Coming Soon!</h3>
            <p className={`${classes.textSecondary} mb-6`}>
              Therapy session booking will be available soon. We're working hard to bring you the best mental health professionals.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 ${classes.textSecondary} hover:${classes.textPrimary} transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-2xl mb-4">
            🧑‍⚕️
          </div>
          <h1 className={`${classes.textPrimary} text-4xl font-bold`}>Therapy Sessions</h1>
          <p className={`${classes.textSecondary} text-lg max-w-2xl mx-auto`}>
            Connect with licensed mental health professionals. Calendar spans January 2025 to December 2030.
          </p>
        </div>

        {/* Calendar and Therapists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <h2 className={`${classes.textPrimary} text-2xl font-bold mb-4`}>Schedule a Session</h2>
            <div className={`${classes.card} p-6`}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={handlePrevMonth}
                  disabled={currentYear === 2025 && currentMonth === 0}
                  className={`p-2 rounded-full ${classes.hover} transition-colors disabled:opacity-50`}
                >
                  ←
                </button>
                <h3 className={`${classes.textPrimary} text-xl font-bold`}>
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  disabled={currentYear === 2030 && currentMonth === 11}
                  className={`p-2 rounded-full ${classes.hover} transition-colors disabled:opacity-50`}
                >
                  →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`text-center py-3 text-sm font-medium ${classes.textMuted}`}>
                    {day}
                  </div>
                ))}
                
                {generateCalendar(currentMonth, currentYear).map((day, index) => (
                  <div key={index} className="aspect-square p-1">
                    {day && (
                      <button 
                        onClick={() => handleDateClick(day)}
                        disabled={isPastDate(day)}
                        className={`w-full h-full text-sm font-medium rounded-lg transition-all ${
                          isDateSelected(day)
                            ? 'bg-blue-500 text-white shadow-lg'
                            : isPastDate(day)
                            ? `${classes.textMuted} cursor-not-allowed opacity-50`
                            : `${classes.textPrimary} ${classes.hover}`
                        }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Therapists Section */}
          <div className="lg:col-span-1">
            <h2 className={`${classes.textPrimary} text-2xl font-bold mb-4`}>Available Therapists</h2>
            <div className="space-y-4">
              {therapists.map((therapist) => (
                <div key={therapist.id} className={`${classes.card} p-6 ${classes.hover} transition-all hover:shadow-lg`}>
                  <div className="space-y-4">
                    <div>
                      <h3 className={`${classes.textPrimary} text-lg font-bold`}>{therapist.name}</h3>
                      <p className={`${classes.textSecondary} text-sm`}>{therapist.specialization}</p>
                      <div className="flex items-center space-x-2 text-sm mt-2">
                        <span className="text-yellow-400">★</span>
                        <span className={classes.textPrimary}>{therapist.rating}</span>
                        <span className={classes.textMuted}>• {therapist.experience}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleBooking}
                      className={`w-full py-3 px-4 rounded-lg font-semibold ${classes.button} ${classes.transition} hover:shadow-lg`}
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyBooking;