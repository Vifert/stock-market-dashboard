import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_KEY = 'NCOIYV61TC8LDEVC';
const API_BASE_URL = 'https://www.alphavantage.co/query';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [stocks, setStocks] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    updateChartData();
  }, [darkMode, stocks]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: API_KEY,
        },
      });
      const timeSeries = response.data['Time Series (Daily)'];
      const stockData = Object.entries(timeSeries)
        .filter(([date]) => new Date(date) >= startDate && new Date(date) <= endDate)
        .map(([date, values]) => ({
          date,
          price: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))
        .reverse();

      setStocks(prevStocks => [...prevStocks, { symbol, data: stockData }]);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const updateChartData = () => {
    const newChartData = {
      labels: stocks[0]?.data.map(d => d.date) || [],
      datasets: stocks.flatMap((stock, index) => [
        {
          label: `${stock.symbol} Price`,
          data: stock.data.map(d => d.price),
          borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.5)`,
          yAxisID: 'y',
          tension: 0.1,
        },
        {
          label: `${stock.symbol} Volume`,
          data: stock.data.map(d => d.volume),
          borderColor: `hsl(${index * 137.5 + 60}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 137.5 + 60}, 70%, 50%, 0.5)`,
          yAxisID: 'y1',
          tension: 0.1,
        }
      ]),
    };
    setChartData(newChartData);
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    if (symbol && !stocks.find(s => s.symbol === symbol)) {
      fetchStockData();
      setSymbol('');
    }
  };

  const handleRemoveStock = (symbolToRemove) => {
    setStocks(prevStocks => prevStocks.filter(s => s.symbol !== symbolToRemove));
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
    animations: {
      x: {
        type: 'number',
        easing: 'linear',
        duration: 1000,
        from: NaN,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * 10;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: 1000,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * 10;
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: darkMode ? 'white' : 'black'
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Price ($)',
          color: darkMode ? 'white' : 'black'
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Volume',
          color: darkMode ? 'white' : 'black'
        },
        ticks: {
          color: darkMode ? 'white' : 'black'
        },
        grid: {
          drawOnChartArea: false,
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? 'white' : 'black'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        titleColor: darkMode ? 'white' : 'black',
        bodyColor: darkMode ? 'white' : 'black'
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Stock Market Dashboard</h1>
        <div className="theme-toggle-container">
          <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          <button onClick={() => setDarkMode(!darkMode)} className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}>
            <div className="toggle-thumb"></div>
          </button>
        </div>
      </header>
      <main>
        <form onSubmit={handleAddStock} className="controls">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g., AAPL)"
          />
          <div className="date-picker">
            <label>Start Date:</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
          </div>
          <div className="date-picker">
            <label>End Date:</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
          </div>
          <button type="submit">Add Stock</button>
        </form>
        <div className="chart-container">
          <Line ref={chartRef} data={chartData} options={chartOptions} key={stocks.length} />
        </div>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Latest Price</th>
              <th>Change</th>
              <th>Change Percent</th>
              <th>Volume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => {
              const latestData = stock.data[stock.data.length - 1];
              const previousData = stock.data[stock.data.length - 2];
              const change = latestData.price - previousData.price;
              const changePercent = (change / previousData.price) * 100;
              return (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>${latestData.price.toFixed(2)}</td>
                  <td className={change >= 0 ? 'positive' : 'negative'}>
                    {change.toFixed(2)}
                  </td>
                  <td className={change >= 0 ? 'positive' : 'negative'}>
                    {changePercent.toFixed(2)}%
                  </td>
                  <td>{latestData.volume.toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleRemoveStock(stock.symbol)}>Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;