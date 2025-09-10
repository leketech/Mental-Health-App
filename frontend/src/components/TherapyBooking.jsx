import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TherapyBooking = () => {
  const { toggleTheme, classes } = useTheme();
  const [selectedDate, setSelectedDate] = useState(5);
  const [currentMonth, setCurrentMonth] = useState('July');
  const [currentYear, setCurrentYear] = useState(2024);
  const [activeTab, setActiveTab] = useState('upcoming');

  const therapists = [
    {
      id: 1,
      name: 'Dr. Amelia Carter',
      specialization: 'Anxiety and Depression',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK5JNrFrPhAUoWqLJPPEPNDRP29gLQ9XfmYUOJXsS5B127RZOls3kTby74Desz4XbwEp8fF0PQA5VF428MGTnSsGPjmhzd3lnkcDwkJ6K4_An4ZDWxwDOdKb6x9PilcUQKMZIqnE-F2iHNvnQaAyMl0bUn-z-wyF9IHbcLM6qltmtj6Z1KuhKA6LZDGOINuC_DSVigz7NSsXVi49IXO4HRAXzzMzAuj62wi6BeJ3M_wmoIE0lIReh1fPadgMSNbeo2Jw3wo30697w'
    },
    {
      id: 2,
      name: 'Dr. Ethan Bennett',
      specialization: 'Relationship Issues',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCfsuKcE_j-6wZ4DRixEom0eANdDj-AOBlgHx6GyWjcfzuF62jPRzMRefUUwYWuWR-k4vGjXa4-vGbGyXGODyrbHLY0Lpf615hLoJbnQuCaudJH02wo8mp-LnaL_qy3S119zXlOvY3bFqh5uKoqetiggGE7nh6r9yyub7pxOPNsxE8LrxkL2Omkmtdff4n7K2Y3s51Ui9NuInGS_PReH8IDsZJT27_xAPGzSdAEfXeiDSR9nlhKKeCfZQlJvqfarEV_l6Z6ug0gME'
    },
    {
      id: 3,
      name: 'Dr. Sophia Clark',
      specialization: 'Stress Management',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHYncHRhH2p6cTNxw0nEDM6EAo8OejkZE5vDhL_cziTSbH_HFjkC2cWt0GZKsI2qv9x27PSnrr481v8Au9y4SlRBJSoqCsXwXzFwdt-7CcIaa9ooXqn_-jMn04FuKdZECSe_ndrEcyOS35jx3cW1j8kQ9AjEGfxgw6FDgLVEDrRsuBZsJ6q2Bkw6fI5znpYIxj8WzrONO8wcZqUps0xbF1Fs3wqDBPKWb-NFBwDPkqNrtPMjZyREMuL0W76iVnoqrTwV3DP_PVQn8'
    }
  ];

  const generateCalendar = (month, year) => {
    const daysInMonth = new Date(year, month === 'July' ? 6 : 7, 0).getDate();
    const firstDay = new Date(year, month === 'July' ? 6 : 7, 1).getDay();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleBooking = (therapistId) => {
    alert(`Booking session with ${therapists.find(t => t.id === therapistId)?.name} on ${currentMonth} ${selectedDate}, ${currentYear}`);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid group-[:not(.bw-theme)]/bw-theme:border-b-slate-200 group-bw-theme/bw-theme:border-b-gray-800 bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-black px-10 py-4">
        <div className="flex items-center gap-3 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white">
          <div className="size-8 text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              <path d="M32 20C32 22.2091 30.2091 24 28 24C25.7909 24 24 22.2091 24 20C24 17.7909 25.7909 16 28 16C30.2091 16 32 17.7909 32 20Z" fill="currentColor"></path>
              <path d="M20 20C20 22.2091 18.2091 24 16 24C13.7909 24 12 22.2091 12 20C12 17.7909 13.7909 16 16 16C18.2091 16 20 17.7909 20 20Z" fill="currentColor"></path>
              <path d="M15 31C15 31 18 35 24 35C30 35 33 31 33 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">UnwindMind</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6">
          <nav className="flex items-center gap-8">
            <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white transition-colors" href="/">Home</a>
            <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white transition-colors" href="/moods">Mood</a>
            <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white transition-colors" href="/journal">Journal</a>
            <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white transition-colors" href="/chat">AI Assistant</a>
            <a className="text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white text-base font-bold leading-normal px-3 py-2 rounded-md bg-blue-50 group-[:not(.bw-theme)]/bw-theme:bg-blue-50 group-bw-theme/bw-theme:bg-gray-800" href="/therapy">Therapy</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 group-[:not(.bw-theme)]/bw-theme:bg-slate-100 group-bw-theme/bw-theme:bg-gray-800 text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:bg-slate-200 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-200 group-bw-theme/bw-theme:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button 
              className="flex items-center justify-center rounded-md p-2 hover:bg-slate-100 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-100 group-bw-theme/bw-theme:hover:bg-gray-800 transition-colors" 
              onClick={toggleTheme}
            >
              <span className="material-symbols-outlined text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400">contrast</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVCuJDySUhoyi7YhHtP2x7pS8EKGYUgxjJpWZqtUGhNsV_DZXxjNMOUBE2dj-wgVUsQHe2iro0ByKPMNJYPyA4iWA_dMEuDiLvdlc9QqWsWySYhRUBf1KCTB822P9qG-x6Nl28uS6dFYU59d2oYZD9Y8D6uCBPCrXns8g1oLzKHxJEd2Nn3fh6_Z6atPnQdIqlXZ4qbIKg4uBqjjQksdzE-7_TJSXD1rAOTPga1By_3cDOrbTvdPUzP1_IE3O-8LpICiFQSg4tZOU")'}}></div>
          </div>
        </div>
      </header>

        {/* Main Content */}
        <main className="flex-1 px-10 py-10">
          <div className="layout-content-container mx-auto flex max-w-7xl flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-4xl font-bold leading-tight tracking-tighter">Therapy Sessions</h1>
              <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-lg font-normal leading-normal">Schedule and manage your therapy sessions with ease.</p>
            </div>
          
            <div className="flex flex-col gap-10">
              {/* Tabs */}
              <div className="border-b border-solid group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-800">
                <div className="flex gap-8 px-4">
                  <button 
                    className={`flex flex-col items-center justify-center border-b-2 py-4 transition-colors ${
                      activeTab === 'upcoming' 
                        ? 'border-blue-600 group-[:not(.bw-theme)]/bw-theme:border-blue-600 group-bw-theme/bw-theme:border-white text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white' 
                        : 'border-transparent text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-gray-300 hover:border-slate-300 group-[:not(.bw-theme)]/bw-theme:hover:border-slate-300 group-bw-theme/bw-theme:hover:border-gray-700'
                    }`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <p className="text-base font-semibold leading-normal">Upcoming</p>
                  </button>
                  <button 
                    className={`flex flex-col items-center justify-center border-b-2 py-4 transition-colors ${
                      activeTab === 'past' 
                        ? 'border-blue-600 group-[:not(.bw-theme)]/bw-theme:border-blue-600 group-bw-theme/bw-theme:border-white text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white' 
                        : 'border-transparent text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-gray-300 hover:border-slate-300 group-[:not(.bw-theme)]/bw-theme:hover:border-slate-300 group-bw-theme/bw-theme:hover:border-gray-700'
                    }`}
                    onClick={() => setActiveTab('past')}
                  >
                    <p className="text-base font-semibold leading-normal">Past</p>
                  </button>
                </div>
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Calendar Section */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-2xl font-bold leading-tight tracking-tight">Book a Session</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-gray-900 rounded-lg border border-slate-200 group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-800">
                  {/* July Calendar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <button className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white p-2 rounded-full">
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <p className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-base font-bold leading-tight text-center">July 2024</p>
                      <div className="w-8"></div>
                    </div>
                    <div className="grid grid-cols-7 text-center">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <p key={day} className="text-slate-500 group-[:not(.bw-theme)]/bw-theme:text-slate-500 group-bw-theme/bw-theme:text-gray-500 text-xs font-bold py-3">{day}</p>
                      ))}
                      {generateCalendar('July', 2024).map((day, index) => (
                        <div key={index} className="py-1">
                          {day && (
                            <button 
                              className={`h-10 w-10 text-sm font-medium leading-normal flex items-center justify-center rounded-full hover:bg-slate-100 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-100 group-bw-theme/bw-theme:hover:bg-gray-800 ${
                                selectedDate === day && currentMonth === 'July' 
                                  ? 'text-white group-[:not(.bw-theme)]/bw-theme:text-black group-bw-theme/bw-theme:text-black bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-white' 
                                  : 'text-slate-700 group-[:not(.bw-theme)]/bw-theme:text-slate-700 group-bw-theme/bw-theme:text-gray-300'
                              }`}
                              onClick={() => handleDateClick(day)}
                            >
                              {day}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* August Calendar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8"></div>
                      <p className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-base font-bold leading-tight text-center">August 2024</p>
                      <button className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white p-2 rounded-full">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-7 text-center">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <p key={day} className="text-slate-500 group-[:not(.bw-theme)]/bw-theme:text-slate-500 group-bw-theme/bw-theme:text-gray-500 text-xs font-bold py-3">{day}</p>
                      ))}
                      {generateCalendar('August', 2024).map((day, index) => (
                        <div key={index} className="py-1">
                          {day && (
                            <button 
                              className={`h-10 w-10 text-sm font-medium leading-normal flex items-center justify-center rounded-full hover:bg-slate-100 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-100 group-bw-theme/bw-theme:hover:bg-gray-800 ${
                                selectedDate === day && currentMonth === 'August' 
                                  ? 'text-white group-[:not(.bw-theme)]/bw-theme:text-black group-bw-theme/bw-theme:text-black bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-white' 
                                  : 'text-slate-700 group-[:not(.bw-theme)]/bw-theme:text-slate-700 group-bw-theme/bw-theme:text-gray-300'
                              }`}
                              onClick={() => {
                                handleDateClick(day);
                                setCurrentMonth('August');
                              }}
                            >
                              {day}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Therapists Section */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-2xl font-bold leading-tight tracking-tight">Available Therapists</h2>
                <div className="flex flex-col gap-4">
                  {therapists.map((therapist) => (
                    <div key={therapist.id} className="flex items-start justify-between gap-4 rounded-lg bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-gray-900 p-4 border border-slate-200 group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-800">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <p className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white text-base font-bold leading-tight">{therapist.name}</p>
                          <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 text-sm font-normal leading-normal">{therapist.specialization}</p>
                        </div>
                        <button 
                          className="flex items-center justify-center rounded-md h-9 px-4 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-white text-white group-[:not(.bw-theme)]/bw-theme:text-white group-bw-theme/bw-theme:text-black text-sm font-bold leading-normal w-fit hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-gray-200 transition-colors"
                          onClick={() => handleBooking(therapist.id)}
                        >
                          <span className="truncate">Book Now</span>
                        </button>
                      </div>
                      <div 
                        className="h-24 w-24 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-md" 
                        style={{backgroundImage: `url("${therapist.image}")`}}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TherapyBooking;