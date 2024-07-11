import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, TrendingUp, Sticker, Palette, X, Info } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';


const tiers = [
  { name: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-600', minLevel: 1, reward: '1 free sticker' },
  { name: 'Silver', color: 'text-gray-400', bgColor: 'bg-gray-400', minLevel: 10, reward: '3 free stickers' },
  { name: 'Gold', color: 'text-yellow-400', bgColor: 'bg-yellow-400', minLevel: 20, reward: '5 free stickers' },
  { name: 'Platinum', color: 'text-blue-300', bgColor: 'bg-blue-300', minLevel: 30, reward: '10 free stickers' },
  { name: 'Diamond', color: 'text-purple-400', bgColor: 'bg-purple-400', minLevel: 40, reward: 'Unlimited stickers' }
];

const achievements = [
  { id: 1, name: '7-Day Streak', description: 'Use the app for 7 consecutive days', icon: '🔥' },
  { id: 2, name: 'Task Master', description: 'Complete 100 tasks', icon: '✅' },
  { id: 3, name: 'Early Bird', description: 'Complete a task before 8 AM', icon: '🐦' },
  { id: 4, name: 'Night Owl', description: 'Complete a task after 10 PM', icon: '🦉' },
  { id: 5, name: 'Jack of All Views', description: 'Use all calendar views', icon: '🗓️' },
];

const stickers = [
  { id: 1, name: 'Unicorn', icon: '🦄' },
  { id: 2, name: 'Pizza', icon: '🍕' },
  { id: 3, name: 'Rocket', icon: '🚀' },
  { id: 4, name: 'Alien', icon: '👽' },
  { id: 5, name: 'Dragon', icon: '🐉' },
  { id: 6, name: 'Wizard', icon: '🧙‍♂️' },
  { id: 7, name: 'Ninja', icon: '🥷' },
  { id: 8, name: 'Robot', icon: '🤖' },
];



function App() {
  const calendarRef = useRef(null);
  const [view, setView] = useState('dayGridMonth');
  const [level, setLevel] = useState(15);
  const [daysUsed, setDaysUsed] = useState(37);
  const [achievementsCount, setAchievementsCount] = useState(3);
  const [stickersCount, setStickersCount] = useState(12);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showTierInfo, setShowTierInfo] = useState(false);

  const changeView = (newView) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      let viewDisplayName = ''; // Variable to hold the user-friendly name
      switch(newView) {
        case 'year':
          calendarApi.changeView('dayGridYear');
          viewDisplayName = 'Year'; // Set display name for year view
          break;
        case 'month':
          calendarApi.changeView('dayGridMonth');
          viewDisplayName = 'Month'; // Set display name for month view
          break;
        case 'week':
          calendarApi.changeView('timeGridWeek');
          viewDisplayName = 'Week'; // Set display name for week view
          break;
        case 'day':
          calendarApi.changeView('timeGridDay');
          viewDisplayName = 'Day'; // Set display name for day view
          break;
        default:
          calendarApi.changeView('dayGridMonth');
          viewDisplayName = 'Month'; // Default to month view
      }
      setView(viewDisplayName); // Use the friendly name instead of the internal view type
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };
  
  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  const calculateLevelProgress = () => {
    return (daysUsed % 10) * 10; // Progress resets every 10 days
  };

  const getCurrentTier = () => {
    return tiers.reduce((acc, tier) => (level >= tier.minLevel ? tier : acc), tiers[0]);
  };

  const getNextTier = () => {
    const currentTierIndex = tiers.findIndex(tier => tier.name === getCurrentTier().name);
    return tiers[currentTierIndex + 1] || null;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Calendar</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300" onClick={() => setShowAchievements(true)}>
            <Award className="inline-block mr-2" /> Achievements
          </button>
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300" onClick={() => setShowStickers(true)}>
            <Sticker className="inline-block mr-2" /> Stickers
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
      {['year', 'month', 'week', 'day'].map((v) => (
        <button
          key={v}
          onClick={() => changeView(v)}
          className={`px-4 py-2 rounded ${view.toLowerCase().includes(v) ? 'bg-gray-300 text-black' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
        >
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </button>
      ))}
    </div>
      
      <div className="flex gap-4 flex-grow">
        <div className="flex-grow w-2/3">
          <div className="bg-white shadow rounded-lg p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {view.replace('dayGrid', '')} View
              </h2>
              <div className="flex items-center space-x-2">
                <button className="p-1" onClick={handlePrev}><ChevronLeft /></button>
                <button className="p-1" onClick={handleNext}><ChevronRight /></button>
              </div>
            </div>
            <div className="flex-grow bg-gray-100 rounded-md overflow-hidden">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={view}
              views={{
                dayGridMonth: { buttonText: 'month' },
                timeGridWeek: { buttonText: 'week' },
                timeGridDay: { buttonText: 'day' },
                dayGridYear: { buttonText: 'year', duration: { years: 1 } }
              }}
              height="100%"
              headerToolbar={false}
              dayMaxEvents={3}
              allDaySlot={false}
              nowIndicator={true}
              eventContent={renderEventContent}
              dayCellClassNames="hover:bg-gray-200 transition-colors duration-200"
              slotMinTime={'07:00:00'}
            />
            </div>
          </div>
        </div>
        
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white shadow rounded-lg p-4 flex-grow">
            <h2 className="text-lg font-semibold mb-2">User Progress</h2>
            <div className="flex items-center mb-2">
              <TrendingUp className="mr-2 h-4 w-4" />
              <div className="text-2xl font-bold">Level {level}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div className={`h-2.5 rounded-full ${getCurrentTier().bgColor}`} style={{width: `${calculateLevelProgress()}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {10 - (daysUsed % 10)} days until next level
            </p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                <div className={`text-sm font-medium ${getCurrentTier().color}`}>{getCurrentTier().name} Tier</div>
              </div>
              <button onClick={() => setShowTierInfo(true)} className="text-blue-500 hover:text-blue-600">
                <Info className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm font-medium">Days used: {daysUsed}</div>
            <div className="text-sm font-medium">Achievements: {achievementsCount}</div>
            <div className="text-sm font-medium">Stickers: {stickersCount}</div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Monthly Stats</h2>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-gray-500">Tasks completed this month</p>
            <div className="mt-4">
              <div className="text-sm font-medium">Current streak: 5 days</div>
              <div className="text-sm font-medium">Longest streak: 12 days</div>
            </div>
          </div>
        </div>
      </div>

      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Achievements</h2>
              <button onClick={() => setShowAchievements(false)}><X /></button>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="text-3xl mr-4">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showStickers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Stickers</h2>
              <button onClick={() => setShowStickers(false)}><X /></button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {stickers.map((sticker) => (
                <div key={sticker.id} className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">{sticker.icon}</div>
                  <div className="text-sm font-medium">{sticker.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTierInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Tier Information</h2>
              <button onClick={() => setShowTierInfo(false)}><X /></button>
            </div>
            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div key={tier.name} className={`p-4 rounded-lg flex items-center justify-between ${tier.name === getCurrentTier().name ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div>
                    <h3 className={`font-bold ${tier.color}`}>{tier.name}</h3>
                    <p className="text-sm text-gray-500">Min Level: {tier.minLevel}</p>
                    <p className="text-sm text-gray-500">Reward: {tier.reward}</p>
                  </div>
                  {tier.name === getCurrentTier().name && <span className="text-green-500">Current</span>}
                  {index === tiers.findIndex(t => t.name === getCurrentTier().name) + 1 && <span className="text-blue-500">Next</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="text-xs p-1 bg-gray-200 rounded truncate">
      {eventInfo.event.title}
    </div>
  )
}

export default App;