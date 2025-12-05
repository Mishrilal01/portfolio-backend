const express = require('express');
const router = express.Router();
const Joi = require('joi');

// In-memory storage (replace with database in production)
let projects = [
  {
    id: 1,
    title: 'Crime Trends in Cities',
    description: 'Comprehensive data analysis dashboard analyzing crime patterns across major cities using Python, Pandas, and Plotly Dash. Features interactive visualizations and trend predictions.',
    image: '/assets/images/crime-dashboard.jpg',
    liveUrl: 'https://example.com/crime-dashboard',
    githubUrl: 'https://github.com/Mishrilal01/CRIME-TRENDS-IN-CITIES',
    tags: ['Python', 'Dash', 'Plotly', 'Pandas', 'Data Analysis'],
    category: 'data-analysis',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Electric Vehicle Data Dashboard',
    description: 'Interactive dashboard built with Excel and Power BI to analyze EV market trends, charging station distribution, and adoption rates with real-time data visualization.',
    image: '/assets/images/ev-dashboard.jpg',
    liveUrl: 'https://example.com/ev-dashboard',
    githubUrl: 'https://github.com/Mishrilal01/Electric-Vehicle-Adoption-Analysis',
    tags: ['Excel', 'Power BI', 'Data Visualization', 'DAX'],
    category: 'data-visualization',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'TaskMaster Intelligent Task Scheduler',
    description: 'A smart task management application built with HTML, CSS, and JavaScript featuring priority-based scheduling, deadline tracking, and productivity analytics.',
    image: '/assets/images/taskmaster.jpg',
    liveUrl: 'https://example.com/taskmaster',
    githubUrl: 'https://github.com/Mishrilal01/TaskMaster-An-Intelligent-Task-Scheduler',
    tags: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
    category: 'web-development',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Financial Performance Dashboard',
    description: 'A dynamic Tableau dashboard visualizing sales, profit, revenue, and product performance with interactive filters, trend analysis, and country-wise insights.',
    image: '/assets/images/Financial.jpg',
    liveUrl: 'https://example.com/customer-ml',
    githubUrl: 'https://github.com/Mishrilal01/Financial-Performance-Dashboard1',
    tags: ['Tableau', 'Data Visualization', 'Data Modeling', 'Business Intelligence'],
    category: 'machine-learning',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Amazon Sales Analytics Dashboard',
    description: 'A fully dynamic and interactive Power BI dashboard showcasing Amazon global sales, profit insights, KPI metrics, trend analysis, and market-wise performance analytics.',
    image: '/assets/images/amazon.jpg',
    liveUrl: 'https://public.tableau.com/mishrilal',
    githubUrl: 'https://github.com/Mishrilal01/Amazon-Sales-Analytics-Dashboard',
    tags: ['DAX Functions', 'Power Query', 'Data Modeling', 'Dynamic Measures'],
    category: 'data-visualization',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: 'Car Sales Dashboard',
    description: 'Python-based weather forecasting application using API integration, featuring 7-day forecasts, historical data analysis, and beautiful data visualizations.',
    image: '/assets/images/car.jpg',
    liveUrl: 'https://example.com/weather-app', 
    githubUrl: 'https://github.com/Mishrilal01/Car-Sales-Dashboard',
    tags: ['Tableau', 'Trend Analysis','Drill-Down Analysis', 'KPI Indicators', 'Tableau Desktop'],
    category: 'python-projects',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    title: 'Real Time Memory Allocation Tracker',
    description: 'A real-time memory allocation tracker visualizing paging and segmentation, enabling dynamic monitoring, efficient debugging, and deeper understanding of operating system memory management.',
    image: '/assets/images/memory-tracer.jpg',
    liveUrl: 'https://example.com/student-analysis',
    githubUrl: 'https://github.com/Mishrilal01/Real-Time-Memory-Allocation-Tracker',
    tags: ['Memory Allocation', 'Paging', 'Segmentation', 'Real-Time Monitoring'],
    category: 'data-analysis',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    title: 'Monasteries of Sikkim',
    description: 'An interactive platform showcasing Sikkim monasteries with filters, virtual tours, cultural insights, service details, and a seamless user experience for digital heritage exploration.',
    image: '/assets/images/sikkimtour.jpg',
    liveUrl: 'https://example.com/inventory',
    githubUrl: 'https://github.com/Mishrilal01/Sikkim-Monasteries1',
    tags: ['Frontend Development', 'Responsive Design', 'UI/UX Design', 'Map Integration','API Integration'],
    category: 'python-projects',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    title: 'Cooking Recipes Site',
    description: 'A simple and elegant cooking recipes website showcasing detailed ingredients, cooking steps, search functionality, and visually appealing recipe layouts for easy navigation.',
    image: '/assets/images/cooking.jpg',
    liveUrl: 'https://example.com/inventory',
    githubUrl: 'https://github.com/Mishrilal01/Cooking-Recipes-Site',
    tags: ['HTML5', 'Responsive Design', 'CSS3', 'JavaScript','UI/UX Design'],
    category: 'python-projects',
    featured: false,
    createdAt: new Date().toISOString()
  }
];

let skills = [
  { id: 1, name: 'HTML/CSS', level: 95, icon: '🎨', category: 'frontend' },
  { id: 2, name: 'JavaScript', level: 90, icon: '⚡', category: 'frontend' },
  { id: 3, name: 'React', level: 88, icon: '⚛️', category: 'frontend' },
  { id: 4, name: 'Node.js', level: 85, icon: '🚀', category: 'backend' },
  { id: 5, name: 'MongoDB', level: 80, icon: '🍃', category: 'database' },
  { id: 6, name: 'Git', level: 90, icon: '📦', category: 'tools' },
  { id: 7, name: 'Python', level: 75, icon: '🐍', category: 'backend' },
  { id: 8, name: 'TypeScript', level: 82, icon: '📘', category: 'frontend' },
  { id: 9, name: 'Tailwind CSS', level: 88, icon: '🎯', category: 'frontend' },
  { id: 10, name: 'Express.js', level: 85, icon: '🔧', category: 'backend' },
  { id: 11, name: 'PostgreSQL', level: 78, icon: '🐘', category: 'database' },
  { id: 12, name: 'Docker', level: 70, icon: '🐳', category: 'tools' }
];

let testimonials = [];

console.log(`Initialized with ${projects.length} projects and ${skills.length} skills`);
