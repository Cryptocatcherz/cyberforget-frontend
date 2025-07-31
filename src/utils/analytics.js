import ReactGA from 'react-ga4';

let lastPageLogged = '';
let lastLogTime = 0;
const DEBOUNCE_TIME = 1000; // 1 second debounce

export const initGA = () => {
    if (process.env.NODE_ENV === 'production') {
        ReactGA.initialize('G-7L01DYHWNN');
    }
};

export const logPageView = () => {
    const currentPath = window.location.pathname + window.location.search;
    const currentTime = Date.now();

    // Prevent duplicate logs within debounce time
    if (currentPath === lastPageLogged && currentTime - lastLogTime < DEBOUNCE_TIME) {
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        ReactGA.send({ hitType: "pageview", page: currentPath });
    } else {
        console.log('Pageview logged:', currentPath);
    }

    lastPageLogged = currentPath;
    lastLogTime = currentTime;
}; 