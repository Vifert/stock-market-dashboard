# Stock Market Dashboard

## Overview
The Stock Market Dashboard is a React-based web application that allows users to track and visualize stock prices and volumes. It provides real-time data visualization, customizable date ranges, and supports multiple stock symbols.

## Features
- Add and remove stock symbols
- Visualize stock prices and volumes in a dynamic, animated chart
- Customizable date range for historical data
- Real-time updates of stock information
- Responsive design for various screen sizes
- Dark mode toggle for comfortable viewing in different lighting conditions

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/stock-market-dashboard.git
   ```
2. Navigate to the project directory:
   ```
   cd stock-market-dashboard
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your Alpha Vantage API key:
   ```
   REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and visit `http://localhost:3000`
3. Enter a stock symbol (e.g., AAPL for Apple Inc.) in the input field and click "Add Stock"
4. Adjust the date range using the date pickers if needed
5. View the chart and table for stock information
6. Toggle between light and dark modes using the switch in the header

## Technologies Used
- React.js
- Chart.js and react-chartjs-2 for data visualization
- Axios for API requests
- react-datepicker for date selection
- Alpha Vantage API for stock data

## API Key
This project uses the Alpha Vantage API to fetch stock data. You need to sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and add it to your `.env` file.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Author
Vifert Jenuben Daniel V