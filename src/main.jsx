/** @jsxImportSource https://esm.sh/react */
import React, { useState, useEffect, useMemo, useCallback } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell } from 'https://esm.sh/recharts';
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  Check,
  Menu,
  X,
  Calendar,
  Layers,
  Share2,
  HelpCircle
} from 'https://esm.sh/lucide-react';

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
    secondary: '#FF6B35',
    light: '#E1F5FE',
    dark: '#0D8BC0',
    danger: '#FF4136',
    success: '#2ECC40',
    warning: '#FFDC00'
  }
};

const NEWS_SOURCES = [
  { id: 'punch', name: 'Punch News', url: 'https://punchng.com' },
  { id: 'guardian', name: 'The Guardian Nigeria', url: 'https://guardian.ng' },
  { id: 'vanguard', name: 'Vanguard News', url: 'https://www.vanguardngr.com' },
  { id: 'dailytrust', name: 'Daily Trust', url: 'https://dailytrust.com' },
  { id: 'thisday', name: 'ThisDay', url: 'https://www.thisdaylive.com' },
  { id: 'nationonlineng', name: 'The Nation', url: 'https://thenationonlineng.net' }
];

const CRIME_CATEGORIES = [
  'Cybercrime',
  'Armed Robbery',
  'Kidnapping',
  'Fraud',
  'Drug Trafficking',
  'Violence',
  'Terrorism',
  'Corruption',
  'Vandalism',
  'Assault'
];

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const SCRAPING_CONFIG = {
  intervals: [
    { value: 15, label: 'Every 15 minutes' },
    { value: 30, label: 'Every 30 minutes' },
    { value: 60, label: 'Every hour' },
    { value: 120, label: 'Every 2 hours' },
    { value: 360, label: 'Every 6 hours' },
    { value: 720, label: 'Every 12 hours' },
    { value: 1440, label: 'Every 24 hours' }
  ],
  sources: NEWS_SOURCES,
  keywords: {
    crime: ['crime', 'arrest', 'police', 'criminal', 'theft', 'robbery', 'kidnap', 'fraud', 'corruption', 'murder', 'trafficking', 'terrorism', 'attack', 'security'],
    exclude: ['sports', 'entertainment', 'celebrity', 'fashion', 'weather']
  }
};

// --------------------
// News Aggregator Class
// --------------------
class NewsAggregator {
  constructor() {
    this.sources = NEWS_SOURCES;
    this.isScrapingActive = false;
    this.lastScrapeTime = null;
    this.scheduledInterval = null;
    this.cachedNews = [];
  }

  async scrapeAllSources() {
    if (this.isScrapingActive) {
      throw new Error('Scraping already in progress');
    }

    try {
      this.isScrapingActive = true;
      const allNews = await Promise.all(
        this.sources.map(source => this.scrapeSingleSource(source))
      );
      this.lastScrapeTime = new Date();
      this.cachedNews = allNews.flat();
      return this.cachedNews;
    } catch (error) {
      console.error('Error scraping sources:', error);
      throw error;
    } finally {
      this.isScrapingActive = false;
    }
  }

  async scrapeSingleSource(source) {
    // Simulated news scraping - replace with actual implementation
    try {
      const mockNews = Array(Math.floor(Math.random() * 5) + 3)
        .fill(null)
        .map((_, i) => {
          const randomCategory = CRIME_CATEGORIES[Math.floor(Math.random() * CRIME_CATEGORIES.length)];
          const randomState = STATES[Math.floor(Math.random() * STATES.length)];
          const randomDaysAgo = Math.random() * 7;
          const date = new Date();
          date.setDate(date.getDate() - randomDaysAgo);

          const titleTemplates = [
            `${randomCategory} incident reported in ${randomState}`,
            `Police arrest suspects in ${randomState} ${randomCategory.toLowerCase()} case`,
            `${randomState} authorities investigate ${randomCategory.toLowerCase()} ring`,
            `New ${randomCategory.toLowerCase()} wave hits ${randomState}`,
            `${randomCategory} alert issued for ${randomState} residents`
          ];

          const summaryTemplates = [
            `Authorities in ${randomState} are investigating a ${randomCategory.toLowerCase()} incident that occurred yesterday. Local residents have been advised to remain vigilant.`,
            `Multiple suspects were arrested in connection with a major ${randomCategory.toLowerCase()} operation in ${randomState}. Security officials praised community cooperation.`,
            `The ${randomState} Police Command has reported an increase in ${randomCategory.toLowerCase()} cases over the past month, prompting new security measures.`,
            `Security experts warn about a sophisticated ${randomCategory.toLowerCase()} scheme targeting ${randomState} residents. Several victims have already reported losses.`,
            `A joint task force has been deployed to address the rising ${randomCategory.toLowerCase()} threat in ${randomState}. Operations are ongoing.`
          ];

          return {
            id: `${source.id}-${crypto.randomUUID().substring(0, 8)}`,
            title: titleTemplates[Math.floor(Math.random() * titleTemplates.length)],
            source: source.name,
            sourceUrl: source.url,
            date: date.toISOString(),
            category: randomCategory,
            state: randomState,
            summary: summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)],
            verified: Math.random() > 0.3
          };
        });
      return mockNews;
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  // Utility methods
  detectCrimeCategory(text) {
    return CRIME_CATEGORIES.find(category => 
      text.toLowerCase().includes(category.toLowerCase())
    ) || 'Other';
  }

  detectState(text) {
    return STATES.find(state => 
      text.toLowerCase().includes(state.toLowerCase())
    ) || 'Unknown';
  }

  isCrimeRelated(text) {
    return SCRAPING_CONFIG.keywords.crime.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  scheduleScrapingInterval(intervalMinutes) {
    if (this.scheduledInterval) {
      clearInterval(this.scheduledInterval);
    }
    if (intervalMinutes > 0) {
      this.scheduledInterval = setInterval(
        () => this.scrapeAllSources(),
        intervalMinutes * 60 * 1000
      );
      return true;
    }
    return false;
  }

  getStatus() {
    return {
      isActive: this.isScrapingActive,
      lastScrapeTime: this.lastScrapeTime,
      scheduledInterval: !!this.scheduledInterval,
      cachedItemsCount: this.cachedNews.length
    };
  }

  generateAnalytics(data) {
    if (!data || data.length === 0) {
      return {
        totalReports: 0,
        categoryBreakdown: {},
        geographicalDistribution: {},
        timeRange: {
          start: new Date().toISOString(),
          end: new Date().toISOString()
        },
        sourcesBreakdown: {},
        verifiedPercentage: 0
      };
    }
    const categoryStats = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const stateStats = data.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + 1;
      return acc;
    }, {});

    const sourceStats = data.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});

    const dates = data.map(item => new Date(item.date));
    const startDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
    const endDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

    return {
      totalReports: data.length,
      categoryBreakdown: categoryStats,
      geographicalDistribution: stateStats,
      timeRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      sourcesBreakdown: sourceStats,
      verifiedPercentage: data.filter(item => item.verified).length / data.length * 100
    };
  }
  
  exportData(data, format = 'json') {
    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      return URL.createObjectURL(blob);
    } else if (format === 'csv') {
      const headers = ['id', 'title', 'source', 'date', 'category', 'state', 'summary', 'verified'].join(',');
      const rows = data.map(item => {
        return [
          item.id,
          `"${item.title.replace(/"/g, '""')}"`,
          item.source,
          item.date,
          item.category,
          item.state,
          `"${item.summary.replace(/"/g, '""')}"`,
          item.verified
        ].join(',');
      });
      const csvString = [headers, ...rows].join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      return URL.createObjectURL(blob);
    }
    throw new Error(`Unsupported export format: ${format}`);
  }
}

// --------------------
// UI Components
// --------------------

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-[APP_CONFIG.brandColors.primary] mr-2" color={APP_CONFIG.brandColors.primary} />
          <div>
            <h1 className="text-xl font-bold">{APP_CONFIG.title}</h1>
            <p className="text-sm text-gray-500">{APP_CONFIG.organization}</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Reports</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Analytics</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Resources</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Help</a>
        </nav>
        <button 
          className="md:hidden p-2 text-gray-500 hover:text-blue-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <nav className="mt-4 py-2 border-t md:hidden">
          <ul className="space-y-2">
            <li><a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Dashboard</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Reports</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Analytics</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Resources</a></li>
            <li><a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">Help</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Information</h3>
          <p className="mb-2">Email: {APP_CONFIG.contact.email}</p>
          <p className="mb-2">Hotline: {APP_CONFIG.contact.hotline}</p>
          <p>{APP_CONFIG.contact.address}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400">Terms of Use</a></li>
            <li><a href="#" className="hover:text-blue-400">Report Incident</a></li>
            <li><a href="#" className="hover:text-blue-400">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <p className="text-sm">{APP_CONFIG.legalNotice}</p>
          <p className="text-sm mt-4">© {new Date().getFullYear()} {APP_CONFIG.organization}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SecurityBadge() {
  return (
    <div className="flex items-center justify-between bg-green-50 border-l-4 border-green-400 p-4 mb-6">
      <div className="flex items-center">
        <ShieldCheck className="h-6 w-6 text-green-500 mr-3" />
        <div>
          <h3 className="font-semibold text-green-800">Secure Connection</h3>
          <p className="text-sm text-green-700">
            This is an official platform of the {APP_CONFIG.organization}
          </p>
        </div>
      </div>
      <a 
        href="#" 
        className="text-sm text-green-700 hover:text-green-800 hover:underline"
        aria-label="Learn more about security"
      >
        Learn more
      </a>
    </div>
  );
}

function SearchAndFilters({ onSearch, initialFilters = {} }) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [selectedState, setSelectedState] = useState(initialFilters.state || '');
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || { start: '', end: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ 
      searchTerm, 
      category: selectedCategory, 
      state: selectedState,
      dateRange
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedState('');
    setDateRange({ start: '', end: '' });
    onSearch({ searchTerm: '', category: '', state: '', dateRange: { start: '', end: '' }});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Search Crime Reports</h2>
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 text-sm hover:underline flex items-center"
        >
          {showAdvanced ? 'Basic Search' : 'Advanced Search'}
          <Filter className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search crime reports..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-4 py-2 w-full md:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CRIME_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="border rounded-md px-4 py-2 w-full md:w-auto"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto"
          >
            Search
          </button>
        </div>
        
        {showAdvanced && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Dashboard({ analytics }) {
  const categoryData = useMemo(() => (
    Object.entries(analytics.categoryBreakdown || {}).map(([name, value]) => ({ name, value }))
  ), [analytics.categoryBreakdown]);
  
  const stateData = useMemo(() => (
    Object.entries(analytics.geographicalDistribution || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))
  ), [analytics.geographicalDistribution]);
  
  const sourcesData = useMemo(() => (
    Object.entries(analytics.sourcesBreakdown || {}).map(([name, value]) => ({ name, value }))
  ), [analytics.sourcesBreakdown]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold mb-2 text-blue-800">Total Reports</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalReports || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="font-semibold mb-2 text-green-800">Verified Reports</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.verifiedPercentage ? `${Math.round(analytics.verifiedPercentage)}%` : 'N/A'}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h3 className="font-semibold mb-2 text-orange-800">Top Category</h3>
          <p className="text-xl font-bold text-orange-600">
            {categoryData.length > 0 ? categoryData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <h3 className="font-semibold mb-2 text-purple-800">Most Active State</h3>
          <p className="text-xl font-bold text-purple-600">
            {stateData.length > 0 ? stateData[0].name : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Crime Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill={APP_CONFIG.brandColors.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">News Sources</h3>
          <div className="h-64 flex items-center justify-center">
            {sourcesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No source data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Top 10 States by Incident Count</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateData} margin={{ left: 20, right: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={APP_CONFIG.brandColors.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function NewsGrid({ news, onExport }) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    return [...news].sort((a, b) => {
      if (sortOption === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortOption === 'category') {
        return sortDirection === 'desc'
          ? b.category.localeCompare(a.category)
          : a.category.localeCompare(b.category);
      } else if (sortOption === 'state') {
        return sortDirection === 'desc'
          ? b.state.localeCompare(a.state)
          : a.state.localeCompare(b.state);
      }
      return 0;
    });
  }, [news, sortOption, sortDirection]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOption" className="text-sm font-medium">Sort by:</label>
          <select id="sortOption" value={sortOption} onChange={handleSortChange} className="border rounded-md px-2 py-1">
            <option value="date">Date</option>
            <option value="category">Category</option>
            <option value="state">State</option>
          </select>
          <button onClick={toggleSortDirection} className="border px-2 py-1 rounded-md text-sm">
            {sortDirection === 'desc' ? 'Desc' : 'Asc'}
          </button>
        </div>
        <div>
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="border px-3 py-1 rounded-md text-sm"
          >
            Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
          </button>
        </div>
      </div>
      {sortedNews.length === 0 ? (
        <div className="text-center text-gray-500">No news available</div>
      ) : (
        <div className={viewMode === 'grid' ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {sortedNews.map(item => (
            <div key={item.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{new Date(item.date).toLocaleString()}</p>
              <p className="text-sm mb-2">{item.summary}</p>
              <div className="text-xs text-gray-500">
                <span className="mr-2">Source: {item.source}</span>
                <span className="mr-2">Category: {item.category}</span>
                <span className="mr-2">State: {item.state}</span>
                <span>{item.verified ? "Verified" : "Unverified"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------
// Top-Level App Component
// --------------------
function App() {
  const [newsData, setNewsData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    categoryBreakdown: {},
    geographicalDistribution: {},
    timeRange: { start: new Date().toISOString(), end: new Date().toISOString() },
    sourcesBreakdown: {},
    verifiedPercentage: 0,
  });
  const [filters, setFilters] = useState({ searchTerm: '', category: '', state: '', dateRange: { start: '', end: '' } });
  const aggregatorRef = useMemo(() => new NewsAggregator(), []);

  const fetchNews = async () => {
    try {
      const news = await aggregatorRef.scrapeAllSources();
      setNewsData(news);
      setAnalytics(aggregatorRef.generateAnalytics(news));
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  useEffect(() => {
    fetchNews();
    // Optionally, schedule periodic scraping:
    // aggregatorRef.scheduleScrapingInterval(60); // every 60 minutes
  }, [aggregatorRef]);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  const handleExport = (format) => {
    const url = aggregatorRef.exportData(newsData, format);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crime-reports.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter news based on search criteria
  const filteredNews = useMemo(() => {
    let result = newsData;
    if (filters.searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    if (filters.state) {
      result = result.filter(item => item.state === filters.state);
    }
    if (filters.dateRange.start) {
      result = result.filter(item => new Date(item.date) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      result = result.filter(item => new Date(item.date) <= new Date(filters.dateRange.end));
    }
    return result;
  }, [newsData, filters]);

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <SecurityBadge />
        <SearchAndFilters onSearch={handleSearch} initialFilters={filters} />
        <div className="mb-6 flex flex-wrap gap-4">
          <button onClick={fetchNews} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Refresh News
          </button>
          <button onClick={() => handleExport('csv')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Export CSV
          </button>
          <button onClick={() => handleExport('json')} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
            Export JSON
          </button>
        </div>
        <NewsGrid news={filteredNews} onExport={handleExport} />
        <Dashboard analytics={analytics} />
      </div>
      <Footer />
    </div>
  );
}

// --------------------
// Render the App
// --------------------
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
