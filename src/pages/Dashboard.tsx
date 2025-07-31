import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '@/composables/useSocket';
import api from '../services/apiService';
import socketService from '../services/socketService';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInfo from '../components/UserInfo';
import DashboardStats from '../components/DashboardStats';
import FeatureToggles from '../components/FeatureToggles';
import DataBrokerListComponent from '../components/DataBrokerListComponent';
import DataPointsComponent from '../components/DataPointsComponent';
import ErrorFallback from '../components/ErrorFallback';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavBar from '../components/MobileNavbar';
import { formatDataBrokerList, getScreenshotUrl } from '../utils';
import './Dashboard.css';
import ImagePreview from '../components/ImagePreview';
import simulationService from '../services/simulationService';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';

const THUMB_IO_API_KEY = 'YOUR_THUMB_IO_API_KEY'; // Replace with your actual API key

// Constants
const TOTAL_SITES = 42; // Total number of data broker sites to scan

// Types
interface DataBroker {
    id: number;
    name: string;
    url: string;
    status: string;
    stage: string | null;
    message: string | null;
    threatLevel: string;
}

interface DashboardStats {
    isScanning: boolean;
    progress: number;
    currentSite: string | null;
    currentStage: string | null;
    message: string | null;
    sitesScanned: number;
    potentialThreats: number;
    totalMatches: number;
    lastScanTime: string | null;
    nextScanTime: string | null;
}

interface DashboardData {
    stats: DashboardStats;
    featureToggles: {
        multi_factor_auth: boolean;
        role_based_access: boolean;
        monitoring_verification: boolean;
        data_leak_notification: boolean;
    };
}

// Initial data broker list
const initialDataBrokers: DataBroker[] = [
    {
        id: 1,
        name: "FastPeopleSearch",
        url: "https://www.fastpeoplesearch.com",
        status: "Pending",
        stage: null,
        message: null,
        threatLevel: "medium"
    },
    {
        id: 2,
        name: "TruePeopleSearch",
        url: "https://www.truepeoplesearch.com",
        status: "Pending",
        stage: null,
        message: null,
        threatLevel: "high"
    }
];

// ... rest of the component implementation stays the same ... 