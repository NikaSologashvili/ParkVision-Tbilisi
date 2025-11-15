import React, { useState, useEffect } from 'react';
import { Camera, Users, BarChart3, MapPin, Clock, TrendingUp, Car, CheckCircle, XCircle, Navigation } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ParkVisionApp = () => {
  const [activeView, setActiveView] = useState('driver');
  const [selectedLocation, setSelectedLocation] = useState('freedom-square');
  const [parkingSpots, setParkingSpots] = useState({});
  const [analytics, setAnalytics] = useState({ total: 0, occupied: 0, free: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Tbilisi parking locations
  const tbilisiLocations = {
    'freedom-square': {
      name: 'Freedom Square Parking',
      nameGeo: 'თავისუფლების მოედანი',
      address: 'Freedom Square, Old Tbilisi',
      coords: { lat: 41.6938, lng: 44.8015 },
      spots: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
      price: '2 GEL/hour'
    },
    'rustaveli': {
      name: 'Rustaveli Avenue Parking',
      nameGeo: 'რუსთაველის გამზირი',
      address: 'Rustaveli Ave, near Parliament',
      coords: { lat: 41.6941, lng: 44.8003 },
      spots: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'],
      price: '3 GEL/hour'
    },
    'vake-park': {
      name: 'Vake Park Parking',
      nameGeo: 'ვაკის პარკი',
      address: 'Chavchavadze Ave, Vake District',
      coords: { lat: 41.7086, lng: 44.7531 },
      spots: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'],
      price: '1.5 GEL/hour'
    },
    'tbilisi-mall': {
      name: 'Tbilisi Mall Parking',
      nameGeo: 'თბილისი მოლი',
      address: 'Tbilisi Mall, Saburtalo',
      coords: { lat: 41.7235, lng: 44.7518 },
      spots: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      price: 'Free (first 2h)'
    }
  };

  const currentLocation = tbilisiLocations[selectedLocation];

  // Initialize parking spots
  useEffect(() => {
    const initialSpots = {};
    currentLocation.spots.forEach(spot => {
      initialSpots[spot] = Math.random() > 0.6 ? 'occupied' : 'free';
    });
    setParkingSpots(initialSpots);
    setSelectedSpot(null);
  }, [selectedLocation]);

  // Calculate analytics
  useEffect(() => {
    const total = Object.keys(parkingSpots).length;
    const occupied = Object.values(parkingSpots).filter(s => s === 'occupied').length;
    const free = total - occupied;
    setAnalytics({ total, occupied, free });
  }, [parkingSpots]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setParkingSpots(prev => {
        const spots = { ...prev };
        const spotKeys = Object.keys(spots);
        const randomSpot = spotKeys[Math.floor(Math.random() * spotKeys.length)];
        spots[randomSpot] = spots[randomSpot] === 'free' ? 'occupied' : 'free';
        return spots;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Mock data
  const hourlyData = [
    { hour: '8AM', occupancy: 45 },
    { hour: '9AM', occupancy: 67 },
    { hour: '10AM', occupancy: 82 },
    { hour: '11AM', occupancy: 91 },
    { hour: '12PM', occupancy: 95 },
    { hour: '1PM', occupancy: 88 },
    { hour: '2PM', occupancy: 79 },
    { hour: '3PM', occupancy: 71 },
    { hour: '4PM', occupancy: 85 },
    { hour: '5PM', occupancy: 92 },
    { hour: '6PM', occupancy: 68 },
  ];

  const weeklyData = [
    { day: 'Mon', avgOccupancy: 78 },
    { day: 'Tue', avgOccupancy: 82 },
    { day: 'Wed', avgOccupancy: 85 },
    { day: 'Thu', avgOccupancy: 88 },
    { day: 'Fri', avgOccupancy: 91 },
    { day: 'Sat', avgOccupancy: 45 },
    { day: 'Sun', avgOccupancy: 32 },
  ];

  const pieData = [
    { name: 'Occupied', value: analytics.occupied },
    { name: 'Free', value: analytics.free },
  ];

  const COLORS = ['#ef4444', '#22c55e'];

  const openInGoogleMaps = (spot) => {
    const { lat, lng } = currentLocation.coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // Driver View Component
  const DriverView = () => {
    const freeSpots = Object.entries(parkingSpots)
      .filter(([_, status]) => status === 'free')
      .map(([spot, _]) => spot);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Find Your Spot in Tbilisi</h2>
          <p className="text-blue-100">პარკირების ადგილების რეალურ დროში ხილვა</p>
        </div>

        {/* Location Selector */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Select Parking Location / აირჩიეთ პარკინგი
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tbilisiLocations).map(([key, loc]) => (
              <button
                key={key}
                onClick={() => setSelectedLocation(key)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedLocation === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-gray-800">{loc.name}</div>
                <div className="text-sm text-gray-600 mb-1">{loc.nameGeo}</div>
                <div className="text-xs text-gray-500">{loc.address}</div>
                <div className="text-xs font-semibold text-blue-600 mt-2">{loc.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Location Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-xl text-gray-800">{currentLocation.name}</h3>
              <p className="text-gray-600 text-sm">{currentLocation.address}</p>
              <p className="text-blue-600 font-semibold mt-1">{currentLocation.price}</p>
            </div>
            <button
              onClick={() => openInGoogleMaps()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Navigation size={16} />
              Directions
            </button>
          </div>

          {/* Embedded Map */}
          <div className="rounded-lg overflow-hidden border-2 border-gray-200">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${currentLocation.coords.lat},${currentLocation.coords.lng}&zoom=17`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-3xl font-bold text-green-600">{analytics.free}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Occupied</p>
                <p className="text-3xl font-bold text-red-600">{analytics.occupied}</p>
              </div>
              <XCircle className="text-red-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
              </div>
              <Car className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* Available Spots List */}
        {freeSpots.length > 0 && (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-xl font-bold text-green-900">Available Now / ხელმისაწვდომი ახლა</h3>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {freeSpots.map(spot => (
                <button
                  key={spot}
                  onClick={() => setSelectedSpot(spot)}
                  className={`p-3 rounded-lg font-bold transition ${
                    selectedSpot === spot
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-700 border-2 border-green-400 hover:bg-green-100'
                  }`}
                >
                  {spot}
                </button>
              ))}
            </div>
            {selectedSpot && (
              <button
                onClick={() => openInGoogleMaps(selectedSpot)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Navigation size={20} />
                Navigate to Spot {selectedSpot}
              </button>
            )}
          </div>
        )}

        {/* Parking Grid */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Car size={20} />
            Live Parking Status / პარკინგის სტატუსი
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(parkingSpots).map(([spot, status]) => (
              <div
                key={spot}
                className={`p-4 rounded-lg text-center font-bold transition-all cursor-pointer ${
                  status === 'free'
                    ? 'bg-green-100 text-green-700 border-2 border-green-400 hover:scale-105'
                    : 'bg-red-100 text-red-700 border-2 border-red-400'
                }`}
                onClick={() => status === 'free' && setSelectedSpot(spot)}
              >
                <Car size={20} className="mx-auto mb-1" />
                <div className="text-sm">{spot}</div>
                <div className="text-xs mt-1">{status === 'free' ? 'Free' : 'Occupied'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminView = () => {
    const occupancyRate = analytics.total > 0 ? ((analytics.occupied / analytics.total) * 100).toFixed(1) : 0;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Admin Dashboard - {currentLocation.name}</h2>
          <p className="text-purple-100">Real-time analytics and insights</p>
        </div>

        {/* Location Selector */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex gap-2 overflow-x-auto">
            {Object.entries(tbilisiLocations).map(([key, loc]) => (
              <button
                key={key}
                onClick={() => setSelectedLocation(key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  selectedLocation === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Occupancy Rate</p>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-purple-600">{occupancyRate}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Available</p>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-green-600">{analytics.free}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Occupied</p>
              <XCircle className="text-red-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-600">{analytics.occupied}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">Total Capacity</p>
              <Car className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-600">{analytics.total}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} />
              Today's Occupancy Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupancy" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Weekly Average Occupancy
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgOccupancy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Current Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">AI Insights & Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-sm font-semibold text-yellow-800">Peak Hour Alert</p>
                <p className="text-xs text-yellow-700">11AM-1PM reaches 95% capacity. Consider dynamic pricing +20%.</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                <p className="text-sm font-semibold text-blue-800">Weekend Opportunity</p>
                <p className="text-xs text-blue-700">Only 35% occupied on weekends. Offer discounts to increase usage.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                <p className="text-sm font-semibold text-green-800">Efficiency Score</p>
                <p className="text-xs text-green-700">Average search time reduced by 73% this week.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">Live Parking Grid - {currentLocation.name}</h3>
          <div className="grid grid-cols-6 gap-3">
            {Object.entries(parkingSpots).map(([spot, status]) => (
              <div
                key={spot}
                className={`p-3 rounded-lg text-center font-bold text-sm transition-all ${
                  status === 'free'
                    ? 'bg-green-100 text-green-700 border-2 border-green-400'
                    : 'bg-red-100 text-red-700 border-2 border-red-400'
                }`}
              >
                {spot}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Camera className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">ParkVision Tbilisi</h1>
                <p className="text-gray-600">AI-Powered Smart Parking for Georgia 🇬🇪</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isSimulating
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isSimulating ? '⏸ Stop Live Demo' : '▶ Start Live Demo'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveView('driver')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              activeView === 'driver'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={20} />
            Driver App
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              activeView === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={20} />
            Admin Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="transition-all duration-300">
          {activeView === 'driver' ? <DriverView /> : <AdminView />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>ParkVision © 2025 - Smart Parking Solution for Tbilisi</p>
          <p className="mt-1">Powered by YOLOv8 AI Detection + Real-time Analytics</p>
        </div>
      </div>
    </div>
  );
};

export default ParkVisionApp;