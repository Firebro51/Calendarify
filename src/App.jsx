import React, { useState, useRef, useEffect  } from 'react';
import { ChevronLeft, ChevronRight, Award, TrendingUp, Sticker, Palette, X, Info, Moon, Sun, Check} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import LoginComponent from './components/LoginComponent';
import Confetti from 'react-confetti';


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
  { name: 'Soft Blue', value: '#A8DADC' },
  { name: 'Sage Green', value: '#8FBC8F' },
  { name: 'Dusty Rose', value: '#E5989B' },
  { name: 'Muted Yellow', value: '#F4D35E' },
  { name: 'Lavender', value: '#CDB4DB' },
  { name: 'Peach', value: '#FFB4A2' },
  { name: 'Mint', value: '#B5E2FA' },
  { name: 'Mauve', value: '#C6A4A4' },
  { name: 'Sky Blue', value: '#90C2E7' },
  { name: 'Pale Pink', value: '#F5CAC3' },
  { name: 'Light Teal', value: '#81B29A' },
  { name: 'Apricot', value: '#FEC89A' },
  { name: 'Periwinkle', value: '#9381FF' },
  { name: 'Seafoam', value: '#97D8C4' },
  { name: 'Lilac', value: '#B8B8FF' },
  { name: 'Coral', value: '#F4A261' },
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
  const [currentEvent, setCurrentEvent] = useState({
    id: '',
    title: '',
    start: '',
    end: '',
    color: eventColors[0].value,
    isRecurring: false,
    recurringPattern: null,
    extendedProps: { completed: false }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const views = ['Month', 'Week', 'Day', 'Year'];
  const [inputErrors, setInputErrors] = useState({
    title: '',
    start: '',
    end: '',
    recurringPattern: '',
  });
  

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
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateNowIndicator();
      }
    }, 60000); // Update every minute
  
    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = (selectInfo) => {
    const id = Date.now().toString();
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);
    setCurrentEvent({
      id: id,
      title: '',
      start: start.toISOString().slice(0, 16), // format: "YYYY-MM-DDTHH:mm"
      end: end.toISOString().slice(0, 16),
      color: eventColors[0].value,
      isRecurring: false,
      recurringPattern: null,
      extendedProps: { completed: false },
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };
  
  const handleEventAdd = () => {
    if (isValidEvent(currentEvent)) {
      const newEvent = {
        ...currentEvent,
        start: new Date(currentEvent.start).toISOString(),
        end: new Date(currentEvent.end).toISOString(),
        extendedProps: { 
          ...currentEvent.extendedProps,
          completed: false,
          isRecurring: currentEvent.isRecurring,
          recurringPattern: currentEvent.isRecurring ? {
            ...currentEvent.recurringPattern,
            endDate: currentEvent.recurringPattern.endDate 
              ? new Date(currentEvent.recurringPattern.endDate).toISOString()
              : null
          } : null
        },
      };
      if (isEditMode) {
        setEvents(events.map(event => 
          event.id === newEvent.id ? newEvent : event
        ));
      } else {
        setEvents([...events, newEvent]);
      }
      setShowEventModal(false);
      resetCurrentEvent();
      setIsEditMode(false);
    }
  };
  
  const resetCurrentEvent = () => {
    setCurrentEvent({
      id: '',
      title: '',
      start: '',
      end: '',
      color: eventColors[0].value,
      isRecurring: false,
      recurringPattern: null,
      extendedProps: { completed: false },
    });
    setInputErrors({
      title: '',
      start: '',
      end: '',
      recurringPattern: '',
    });
  };
  
  const isValidEvent = (event) => {
    const errors = {
      title: '',
      start: '',
      end: '',
      recurringPattern: '',
    };
  
    if (!event.title.trim()) {
      errors.title = 'Title is required';
    }
  
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
  
    if (isNaN(startDate.getTime())) {
      errors.start = 'Invalid start date/time';
    }
  
    if (isNaN(endDate.getTime())) {
      errors.end = 'Invalid end date/time';
    }
  
    if (startDate >= endDate) {
      errors.end = 'End date/time must be after start date/time';
    }
  
    if (event.isRecurring) {
      if (!event.recurringPattern || !event.recurringPattern.frequency) {
        errors.recurringPattern = 'Please select a frequency for recurring events';
      }
      if (event.recurringPattern?.frequency === 'weekly' && 
          (!event.recurringPattern.daysOfWeek || event.recurringPattern.daysOfWeek.length === 0)) {
        errors.recurringPattern = 'Please select at least one day of the week for weekly recurring events';
      }
    }
  
    setInputErrors(errors);
    return Object.values(errors).every(error => error === '');
  };
  
  const handleEventClick = (clickInfo) => {
    const start = new Date(clickInfo.event.start);
    const end = new Date(clickInfo.event.end);
    setCurrentEvent({
      id: clickInfo.event.extendedProps.originalEventId || clickInfo.event.id,
      title: clickInfo.event.title,
      start: start.toISOString().slice(0, 16),
      end: end.toISOString().slice(0, 16),
      color: clickInfo.event.backgroundColor,
      isRecurring: clickInfo.event.extendedProps.isRecurring || false,
      recurringPattern: clickInfo.event.extendedProps.recurringPattern || null,
      extendedProps: {
        ...clickInfo.event.extendedProps,
        originalEventId: clickInfo.event.extendedProps.originalEventId || clickInfo.event.id
      },
    });
    setIsEditMode(true);
    setShowEventModal(true);
  };

  const handleEventComplete = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, extendedProps: { ...event.extendedProps, completed: true } } : event
    ));
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
  };

  const handleCalendarRightClick = (e) => {
    e.preventDefault(); // Prevent the default context menu
  };

  const handleEventRightClick = (info, jsEvent) => {
    jsEvent.preventDefault(); // Prevent the default context menu
    jsEvent.stopPropagation(); // Stop the event from bubbling up
    handleEventClick(info); // Reuse the existing click handler
  };

  const handleEventDrop = (dropInfo) => {
    const updatedEvent = {
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.start.toISOString(),
      end: dropInfo.event.end.toISOString(),
      color: dropInfo.event.backgroundColor,
      isRecurring: dropInfo.event.extendedProps.isRecurring || false,
      recurringPattern: dropInfo.event.extendedProps.recurringPattern || null,
      extendedProps: dropInfo.event.extendedProps || { completed: false },
    };
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventResize = (resizeInfo) => {
    const updatedEvent = {
      id: resizeInfo.event.id,
      title: resizeInfo.event.title,
      start: resizeInfo.event.start.toISOString(),
      end: resizeInfo.event.end.toISOString(),
      color: resizeInfo.event.backgroundColor,
      isRecurring: resizeInfo.event.extendedProps.isRecurring || false,
      recurringPattern: resizeInfo.event.extendedProps.recurringPattern || null,
      extendedProps: resizeInfo.event.extendedProps || { completed: false },
    };
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = () => {
    if (currentEvent.extendedProps.isRecurring) {
      // For recurring events, delete all instances
      setEvents(events.filter(event => event.id !== currentEvent.id && event.extendedProps.originalEventId !== currentEvent.id));
    } else {
      // For non-recurring events, delete the single event
      setEvents(events.filter(event => event.id !== currentEvent.id));
    }
    setShowEventModal(false);
    resetCurrentEvent();
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

  const renderNowIndicator = (props) => {
    return (
      <div className="custom-now-indicator" style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: props.top,
        height: 0,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 4
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#1E88E5',
          marginLeft: '-6px',
        }}></div>
        <div style={{
          borderTop: '2px solid #1E88E5',
          flexGrow: 1,
        }}></div>
      </div>
    );
  };

  const handleAuthChange = (authState) => {
    setIsAuthenticated(authState);
    // You might want to load user-specific data here when they log in
  };

  const expandRecurringEvents = (events, start, end) => {
    return events.flatMap(event => {
      if (!event.extendedProps.isRecurring) return [event];
  
      const { recurringPattern } = event.extendedProps;
      const expandedEvents = [];
      let currentDate = new Date(Math.max(new Date(event.start), start));
      const endDate = new Date(end);
  
      while (currentDate <= endDate && (!recurringPattern.endDate || currentDate <= new Date(recurringPattern.endDate))) {
        if (recurringPattern.frequency === 'daily' ||
            (recurringPattern.frequency === 'weekly' && recurringPattern.daysOfWeek.includes(currentDate.getDay())) ||
            (recurringPattern.frequency === 'monthly' && currentDate.getDate() === new Date(event.start).getDate()) ||
            (recurringPattern.frequency === 'yearly' && 
             currentDate.getMonth() === new Date(event.start).getMonth() && 
             currentDate.getDate() === new Date(event.start).getDate())) {
          
          const eventStart = new Date(currentDate);
          eventStart.setHours(new Date(event.start).getHours());
          eventStart.setMinutes(new Date(event.start).getMinutes());
          
          const eventEnd = new Date(currentDate);
          eventEnd.setHours(new Date(event.end).getHours());
          eventEnd.setMinutes(new Date(event.end).getMinutes());
          
          expandedEvents.push({
            ...event,
            id: `${event.id}-${eventStart.toISOString()}`,
            start: eventStart.toISOString(),
            end: eventEnd.toISOString(),
            extendedProps: {
              ...event.extendedProps,
              originalEventId: event.id,
            },
          });
        }
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return expandedEvents;
    });
  };

  return (
    <div className="p-4 w-full mx-auto h-screen flex flex-col dark:bg-gray-800 dark:text-white">
      {showConfetti && <Confetti />}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendarify</h1>
        <div className="flex gap-2">
          <LoginComponent onAuthChange={handleAuthChange} darkMode={darkMode} />
          <button className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="inline-block" /> : <Moon className="inline-block" />}
          </button>
          {isAuthenticated && (
             <>
              <button 
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center" 
                onClick={() => setShowAchievements(true)}
              >
                <Award className="h-5 w-5 mr-2" /> Achievements
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center" 
                onClick={() => setShowStickers(true)}
              >
                <Sticker className="h-5 w-5 mr-2" /> Stickers
              </button>
            </>
          )}
        </div>
      </div>
    

      <div className="flex gap-4 mb-4">
        {views.map((viewName) => (
          <button
            key={viewName}
            onClick={() => changeView(viewName.toLowerCase())}
            className={`px-4 py-2 rounded transition-colors ${
              view.toLowerCase() === viewName.toLowerCase()
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {viewName}
          </button>
        ))}
      </div>
      
    <div className="flex gap-4 flex-grow">
        <div className="flex-grow w-4/5">
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
            <div className="flex-grow bg-gray-100 rounded-md overflow-hidden dark:bg-gray-600 custom-scrollbar"
                 onContextMenu={handleCalendarRightClick}
            >
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
                nowIndicatorClassNames="custom-now-indicator"
                nowIndicatorContent={renderNowIndicator}
                eventContent={renderEventContent}
                dayCellClassNames={`hover:bg-gray-200 transition-colors duration-200 ${darkMode ? 'dark:hover:bg-gray-500' : ''}`}
                slotMinTime={'00:00:00'}
                slotMaxTime={'24:00:00'}
                scrollTime={currentTime}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                events={(fetchInfo, successCallback) => {
                  const expandedEvents = expandRecurringEvents(events, fetchInfo.start, fetchInfo.end);
                  successCallback(expandedEvents);
                }}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                eventDidMount={(info) => {
                  info.el.addEventListener('contextmenu', (e) => handleEventRightClick(info, e));
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="w-1/5 flex flex-col gap-4">
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
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-white">{isEditMode ? 'Edit Event' : 'Add New Event'}</h2>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Event Title"
                value={currentEvent.title}
                onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                className={`w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  inputErrors.title ? 'border-red-500' : ''
                }`}
              />
              {inputErrors.title && <p className="text-red-500 text-sm mt-1">{inputErrors.title}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Start</label>
              <input
                type="datetime-local"
                value={currentEvent.start}
                onChange={(e) => setCurrentEvent({...currentEvent, start: e.target.value})}
                className={`w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  inputErrors.start ? 'border-red-500' : ''
                }`}
              />
              {inputErrors.start && <p className="text-red-500 text-sm mt-1">{inputErrors.start}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">End</label>
              <input
                type="datetime-local"
                value={currentEvent.end}
                onChange={(e) => setCurrentEvent({...currentEvent, end: e.target.value})}
                className={`w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  inputErrors.end ? 'border-red-500' : ''
                }`}
              />
              {inputErrors.end && <p className="text-red-500 text-sm mt-1">{inputErrors.end}</p>}
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentEvent.isRecurring}
                  onChange={(e) => setCurrentEvent({...currentEvent, isRecurring: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-300">Recurring Event</span>
              </label>
            </div>

            {currentEvent.isRecurring && (
              <div className="mb-4">
                <select
                  value={currentEvent.recurringPattern?.frequency || ''}
                  onChange={(e) => setCurrentEvent({
                    ...currentEvent, 
                    recurringPattern: {...(currentEvent.recurringPattern || {}), frequency: e.target.value}
                  })}
                  className={`w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    inputErrors.recurringPattern ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                {currentEvent.recurringPattern?.frequency === 'weekly' && (
                  <div className="mt-2 flex flex-wrap">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <label key={day} className="inline-flex items-center mr-2 mb-2">
                        <input
                          type="checkbox"
                          checked={currentEvent.recurringPattern?.daysOfWeek?.includes(index) || false}
                          onChange={() => {
                            const daysOfWeek = currentEvent.recurringPattern?.daysOfWeek || [];
                            const updatedDays = daysOfWeek.includes(index)
                              ? daysOfWeek.filter(d => d !== index)
                              : [...daysOfWeek, index];
                            setCurrentEvent({
                              ...currentEvent,
                              recurringPattern: {...(currentEvent.recurringPattern || {}), daysOfWeek: updatedDays}
                            });
                          }}
                          className="mr-1"
                        />
                        <span className="text-sm text-gray-300">{day}</span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date (optional)</label>
                  <input
                    type="date"
                    value={currentEvent.recurringPattern?.endDate || ''}
                    onChange={(e) => setCurrentEvent({
                      ...currentEvent,
                      recurringPattern: {...(currentEvent.recurringPattern || {}), endDate: e.target.value}
                    })}
                    className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {inputErrors.recurringPattern && <p className="text-red-500 text-sm mt-1">{inputErrors.recurringPattern}</p>}
              </div>
            )}

            <div className="grid grid-cols-8 gap-2 mb-4">
              {eventColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setCurrentEvent({...currentEvent, color: color.value})}
                  className={`w-6 h-6 rounded-full ${currentEvent.color === color.value ? 'ring-2 ring-offset-2 ring-white' : ''}`}
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
                onClick={() => {
                  setShowEventModal(false);
                  resetCurrentEvent();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 mr-2"
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

const renderEventContent = (eventInfo) => {
  const textColor = getContrastColor(eventInfo.event.backgroundColor);
  
  return (
    <div 
      className="w-full h-full p-1 overflow-hidden relative group"
      style={{
        backgroundColor: eventInfo.event.backgroundColor,
        color: textColor,
      }}
    >
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {eventInfo.event.title}
      </div>
      {!eventInfo.event.extendedProps.completed && (
        <div className="absolute top-0 right-0 hidden group-hover:block">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleEventComplete(eventInfo.event.id);
            }}
            className="bg-green-500 text-white rounded-full p-1 hover:bg-green-600"
          >
            <Check size={12} />
          </button>
        </div>
      )}
      {eventInfo.event.extendedProps.completed && (
        <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
          <Check size={12} color="white" />
        </div>
      )}
    </div>
  );
};

// Helper function to determine contrasting text color
function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}


export default App;