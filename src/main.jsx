/** @jsxImportSource react */
import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Search, Filter, Download, MapPin, AlertTriangle } from 'lucide-react';

// Configuration
const APP_CONFIG = {
  title: "DSA Crime Intelligence Platform",
  organization: "Defence Space Administration",
  contact: {
    email: "deo@dsa.mil.ng",
    hotline: "0800-DSA-INFO",
    address: "Obasanjo Space Centre, Abuja, Airport Rd, Abuja 900107, Federal Capital Territory Nigeria"
  },
  legalNotice: "Official crime monitoring system of the Geospatial Intelligence Fusion and Data Centre",
  brandColors: {
    primary: '#15A6DF',
    secondary: '#FF6B35'
  }
};

const NEWS_SOURCES = [
  { id: 'punch', name: 'Punch News', url: 'https://punchng.com' },
  { id: 'guardian', name: 'The Guardian Nigeria', url: 'https://guardian.ng' },
  { id: 'vanguard', name: 'Vanguard News', url: 'https://www.vanguardngr.com' },
  { id: 'dailytrust', name: 'Daily Trust', url: 'https://dailytrust.com' }
];

const CRIME_CATEGORIES = [
  'Cybercrime',
  'Armed Robbery',
  'Kidnapping',
  'Fraud',
  'Drug Trafficking',
  'Violence',
  'Terrorism'
];

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

class NewsAggregator {
  constructor() {
    this.sources = NEWS_SOURCES;
  }

  async scrapeAllSources() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.scrapeSingleSource(source))
      );
      return allNews.flat();
    } catch (error) {
      console.error('Error scraping sources:', error);
      throw error;
    }
  }

  async scrapeSingleSource(source) {
    // Simulated news scraping - replace with actual implementation
    const mockNews = Array(5).fill(null).map((_, i) => ({
      id: `${source.id}-${i}`,
      title: `Crime Report ${i + 1} from ${source.name}`,
      source: source.name,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: CRIME_CATEGORIES[Math.floor(Math.random() * CRIME_CATEGORIES.length)],
      state: STATES[Math.floor(Math.random() * STATES.length)],
      summary: `Summary of crime incident ${i + 1} from ${source.name}...`
    }));
    
    return mockNews;
  }

  generateAnalytics(data) {
    const categoryStats = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const stateStats = data.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReports: data.length,
      categoryBreakdown: categoryStats,
      geographicalDistribution: stateStats,
      timeRange: {
        start: new Date(Math.min(...data.map(item => new Date(item.date)))).toISOString(),
        end: new Date(Math.max(...data.map(item => new Date(item.date)))).toISOString()
      }
    };
  }
}

function SearchAndFilters({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, category: selectedCategory, state: selectedState });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search crime reports..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="border rounded-md px-4 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CRIME_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="border rounded-md px-4 py-2"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-brand-dark"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ analytics }) {
  const categoryData = useMemo(() => (
    Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
      name,
      value
    }))
  ), [analytics.categoryBreakdown]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-heading font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-brand-light p-4 rounded-lg">
          <h3 className="font-heading font-semibold mb-2">Total Reports</h3>
          <p className="text-3xl font-bold text-brand-primary">
            {analytics.totalReports}
          </p>
        </div>
        <div className="bg-brand-light p-4 rounded-lg">
          <h3 className="font-heading font-semibold mb-2">Time Range</h3>
          <p className="text-sm">
            {new Date(analytics.timeRange.start).toLocaleDateString()} - 
            {new Date(analytics.timeRange.end).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-brand-light p-4 rounded-lg">
          <h3 className="font-heading font-semibold mb-2">Most Active State</h3>
          <p className="text-xl font-bold text-brand-primary">
            {Object.entries(analytics.geographicalDistribution)
              .sort((a, b) => b[1] - a[1])[0][0]}
          </p>
        </div>
      </div>
      <div className="h-80">
        <BarChart width={800} height={300} data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={APP_CONFIG.brandColors.primary} />
        </BarChart>
      </div>
    </div>
  );
}

function NewsGrid({ news }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map(item => (
        <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4" />
            {item.state}
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{item.summary}</p>
          <div className="flex justify-between items-center">
            <span className="bg-brand-light text-brand-primary px-3 py-1 rounded-full text-sm">
              {item.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <AlertTriangle className="h-6 w-6 text-yellow-400" />
        <div className="ml-3">
          <h3 className="font-heading font-semibold">Privacy Notice</h3>
          <p className="text-sm text-gray-600">
            This platform contains sensitive information. Unauthorized access or sharing is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

function CrimeNewsApp({ data, analytics }) {
  const [filteredNews, setFilteredNews] = useState(data);
  const [currentAnalytics, setCurrentAnalytics] = useState(analytics);

  const handleSearch = ({ searchTerm, category, state }) => {
    const filtered = data.filter(item => {
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !category || item.category === category;
      const matchesState = !state || item.state === state;
      return matchesSearch && matchesCategory && matchesState;
    });
    
    setFilteredNews(filtered);
    const aggregator = new NewsAggregator();
    setCurrentAnalytics(aggregator.generateAnalytics(filtered));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SecurityBadge />
        <PrivacyNotice />
        <SearchAndFilters onSearch={handleSearch} />
        <Dashboard analytics={currentAnalytics} />
        <NewsGrid news={filteredNews} />
      </main>
      <Footer />
    </div>
  );
}

export default async function handler(request) {
  try {
    const aggregator = new NewsAggregator();
    
    if (request.headers.get('Accept')?.includes('application/json')) {
      const data = await aggregator.scrapeAllSources();
      return new Response(JSON.stringify({
        status: "success",
        data,
        analytics: aggregator.generateAnalytics(data)
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Powered-By': APP_CONFIG.organization
        }
      });
    }

    let initialData = [];
    try {
      initialData = await aggregator.scrapeAllSources();
    } catch (error) {
      console.error("Scraping error:", error);
    }

    return new Response(renderHTML(initialData), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    return new Response(renderErrorPage(error), {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}