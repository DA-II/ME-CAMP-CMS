import React from 'react';

export const MELogo = ({ className = "h-8 w-auto" }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="50" cy="50" r="45" fill="#4F46E5" />
        <path
            d="M25 30H35L45 50L55 30H65V70H55V45L45 65L35 45V70H25V30Z"
            fill="white"
        />
    </svg>
);

export const generateFavicon = () => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#4F46E5"/>
            <path d="M25 30H35L45 50L55 30H65V70H55V45L45 65L35 45V70H25V30Z" fill="white"/>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default MELogo; 