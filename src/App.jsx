import React, { useState, useRef, useEffect  } from 'react';
import { ChevronLeft, ChevronRight, Award, TrendingUp, Sticker, Palette, X, Info, Moon, Sun } from 'lucide-react';
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

const eventColors = [
  { name: 'Pastel Blue', value: '#A7C7E7' },
  { name: 'Pastel Green', value: '#C1E1C1' },
  { name: 'Pastel Pink', value: '#FFB3BA' },
  { name: 'Pastel Yellow', value: '#FDFD96' },
  { name: 'Pastel Lavender', value: '#E6E6FA' },
  { name: 'Pastel Peach', value: '#FFDAB9' },
  { name: 'Pastel Mint', value: '#98FF98' },
  { name: 'Pastel Coral', value: '#FFB7B2' },
  { name: 'Pastel Lilac', value: '#C8A2C8' },
  { name: 'Pastel Lemon', value: '#FFFACD' },
  { name: 'Pastel Periwinkle', value: '#CCCCFF' },
  { name: 'Pastel Apricot', value: '#FFE5B4' },
  { name: 'Pastel Aqua', value: '#E0FFFF' },
  { name: 'Pastel Mauve', value: '#D8BFD8' },
  { name: 'Pastel Sky Blue', value: '#87CEEB' },
  { name: 'Pastel Rose', value: '#FFE4E1' },
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
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ id: '', title: '', start: '', end: '', color: eventColors[0].value });
  const [isEditMode, setIsEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  function getCurrentTime() {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Set minutes and seconds to 0
    return now.toTimeString().split(' ')[0];
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // Update every minute, but it will only change on the hour

    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (selectInfo) => {
    const id = Date.now().toString(); // Convert to string for consistency
    setCurrentEvent({
      id: id,
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      color: eventColors[0].value
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };

  const handleEventAdd = () => {
    if (currentEvent.title) {
      if (isEditMode) {
        setEvents(events.map(event => 
          event.id === currentEvent.id ? currentEvent : event
        ));
      } else {
        setEvents([...events, currentEvent]);
      }
      setShowEventModal(false);
      setCurrentEvent({ id: '', title: '', start: '', end: '', color: eventColors[0].value });
      setIsEditMode(false);
    }
  };

  const handleEventClick = (clickInfo) => {
    setCurrentEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      color: clickInfo.event.backgroundColor
    });
    setIsEditMode(true);
    setShowEventModal(true);
  };

  const handleEventDrop = (dropInfo) => {
    const updatedEvent = {
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.startStr,
      end: dropInfo.event.endStr,
      color: dropInfo.event.backgroundColor,
    };
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventResize = (resizeInfo) => {
    const updatedEvent = {
      id: resizeInfo.event.id,
      title: resizeInfo.event.title,
      start: resizeInfo.event.startStr,
      end: resizeInfo.event.endStr,
      color: resizeInfo.event.backgroundColor,
    };
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = () => {
    setEvents(events.filter(event => event.id !== currentEvent.id));
    setShowEventModal(false);
    setCurrentEvent({ id: '', title: '', start: '', end: '', color: eventColors[0].value });
    setIsEditMode(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.getElementById('root');
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="p-4 max-w-7xl mx-auto h-screen flex flex-col dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendarify</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="inline-block" /> : <Moon className="inline-block" />}
          </button>
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={() => setShowAchievements(true)}>
            <Award className="inline-block mr-2" /> Achievements
          </button>
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={() => setShowStickers(true)}>
            <Sticker className="inline-block mr-2" /> Stickers
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
      {['year', 'month', 'week', 'day'].map((v) => (
        <button
          key={v}
          onClick={() => changeView(v)}
          className={`px-4 py-2 rounded ${
            view.toLowerCase().includes(v) 
              ? 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white' 
              : 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          }`}
        >
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </button>
      ))}
    </div>
      
    <div className="flex gap-4 flex-grow">
        <div className="flex-grow w-2/3">
          <div className="bg-white shadow rounded-lg p-4 h-full flex flex-col dark:bg-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {view.replace('dayGrid', '')} View
              </h2>
              <div className="flex items-center space-x-2">
                <button className="p-1" onClick={handlePrev}><ChevronLeft /></button>
                <button className="p-1" onClick={handleNext}><ChevronRight /></button>
              </div>
            </div>
            <div className="flex-grow bg-gray-100 rounded-md overflow-hidden dark:bg-gray-600 custom-scrollbar" style={{ height: 'calc(100vh - 200px)' }}>
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
                dayCellClassNames={`hover:bg-gray-200 transition-colors duration-200 ${darkMode ? 'dark:hover:bg-gray-500' : ''}`}
                slotMinTime={'00:00:00'}
                slotMaxTime={'24:00:00'}
                scrollTime={currentTime}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
              />
            </div>
          </div>
        </div>
        
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white shadow rounded-lg p-4 flex-grow dark:bg-gray-700">
            <h2 className="text-lg font-semibold mb-2">User Progress</h2>
            <div className="flex items-center mb-2">
              <TrendingUp className="mr-2 h-4 w-4" />
              <div className="text-2xl font-bold">Level {level}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:bg-gray-600">
              <div className={`h-2.5 rounded-full ${getCurrentTier().bgColor}`} style={{width: `${calculateLevelProgress()}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {10 - (daysUsed % 10)} days until next level
            </p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                <div className={`text-sm font-medium ${getCurrentTier().color}`}>{getCurrentTier().name} Tier</div>
              </div>
              <button 
                onClick={() => setShowTierInfo(true)} 
                cclassName="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                title="View tier information and rewards"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm font-medium">Days Used: {daysUsed}</div>
            <div className="text-sm font-medium">Achievements: {achievementsCount}</div>
            <div className="text-sm font-medium">Stickers: {stickersCount}</div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4 dark:bg-gray-700">
            <h2 className="text-lg font-semibold mb-2">Monthly Stats</h2>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tasks completed this month</p>
            <div className="mt-4">
              <div className="text-sm font-medium">Current streak: 5 days</div>
              <div className="text-sm font-medium">Longest streak: 12 days</div>
            </div>
          </div>
        </div>
      </div>

      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Achievements</h2>
              <button onClick={() => setShowAchievements(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X /></button>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-gray-100 p-4 rounded-lg flex items-center dark:bg-gray-600">
                  <div className="text-3xl mr-4">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold dark:text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showStickers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Stickers</h2>
              <button onClick={() => setShowStickers(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X /></button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {stickers.map((sticker) => (
                <div key={sticker.id} className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center dark:bg-gray-600">
                  <div className="text-4xl mb-2">{sticker.icon}</div>
                  <div className="text-sm font-medium dark:text-white">{sticker.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTierInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full dark:bg-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">Tier Information</h2>
              <button onClick={() => setShowTierInfo(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X /></button>
            </div>
            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div key={tier.name} className={`p-4 rounded-lg flex items-center justify-between ${
                  tier.name === getCurrentTier().name 
                    ? 'bg-green-100 dark:bg-green-800' 
                    : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <div>
                    <h3 className={`font-bold ${tier.color}`}>{tier.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Min Level: {tier.minLevel}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Reward: {tier.reward}</p>
                  </div>
                  {tier.name === getCurrentTier().name && <span className="text-green-500 dark:text-green-300">Current</span>}
                  {index === tiers.findIndex(t => t.name === getCurrentTier().name) + 1 && <span className="text-blue-500 dark:text-blue-300">Next</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md w-full dark:bg-gray-700">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{isEditMode ? 'Edit Event' : 'Add New Event'}</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={currentEvent.title}
              onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
            <div className="grid grid-cols-8 gap-2 mb-4">
              {eventColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setCurrentEvent({...currentEvent, color: color.value})}
                  className={`w-6 h-6 rounded-full ${currentEvent.color === color.value ? 'ring-2 ring-offset-2 ring-black dark:ring-white' : ''}`}
                  style={{backgroundColor: color.value}}
                  title={color.name}
                ></button>
              ))}
            </div>
            <div className="flex justify-end">
              {isEditMode && (
                <button 
                  onClick={handleEventDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                >
                  Delete
                </button>
              )}
              <button 
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 mr-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleEventAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditMode ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="w-full h-full p-1 text-gray-800 dark:text-white" style={{backgroundColor: eventInfo.event.backgroundColor}}>
      {eventInfo.event.title}
    </div>
  )
}

export default App;