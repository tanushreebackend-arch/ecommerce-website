'use client';

import { DashboardAdminProfile } from './DashboardAdminProfile';

const YEAR_OPTIONS = ['This Year', 'This Month', 'Last 7 Days', 'All Time'];

export function DashboardWelcomeHeader() {
  return (
    <div className="dash-header">
      <div className="dash-header-top">
        <p className="dash-header-greeting">Welcome back,</p>
        <DashboardAdminProfile />
      </div>
      <div className="dash-section-header">
        <div>
          <h1 className="dash-section-title">Sales &amp; Business Overview</h1>
          <p className="dash-section-subtitle">
            Track revenue and understand business growth through real-time insights
          </p>
        </div>
        <select className="dash-year-select" defaultValue="This Year" aria-label="Time period">
          {YEAR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
