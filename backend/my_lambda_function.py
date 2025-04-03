import requests
import json

API_KEY = "demo"

def lambda_handler(event, context):
    # Get stock symbol from event (passed in API Gateway or test event)
    symbol = event.get("symbol", "").upper()
    
    if not symbol:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Stock symbol is required"})
        }

    # API endpoint for daily stock prices
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}"

    # Fetch stock data
    response = requests.get(url)
    data = response.json()

    # Check if response contains valid stock data
    if "Time Series (Daily)" in data:
        time_series = data["Time Series (Daily)"]
        latest_date = max(time_series.keys())  # Most recent trading day

        latest_data = time_series[latest_date]
        latest_stock_info = {
            "symbol": symbol,
            "date": latest_date,
            "open": latest_data["1. open"],
            "high": latest_data["2. high"],
            "low": latest_data["3. low"],
            "close": latest_data["4. close"],
        }

        return {
            "statusCode": 200,
            "body": json.dumps(latest_stock_info)
        }

    else:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": f"Unable to fetch stock data for '{symbol}'"})
        }