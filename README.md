# oigetit Dashboard

A modern analytics dashboard for monitoring. This dashboard provides interactive visualizations of country-based metrics including volume, political bias, and sentiment analysis.

## Dashboard Overview

The oigetit Dashboard provides real-time insights into global conversations, allowing users to:

- Monitor sentiment analysis by region
- Analyze political bias in conversations
- Compare data across different time periods
- Visualize geographic distribution of conversations

## Main Dashboard Components

### World Map Visualization

The interactive world map displays conversation volume by country. Countries are color-coded based on their conversation volume percentage:

- Gray: No data
- Light blue: 0%-0.1% of total volume
- Light-medium blue: 0.1%-1% of total volume
- Medium blue: 1%-2% of total volume
- Dark blue: 2%-10% of total volume
- Very dark blue: 10%+ of total volume

The map automatically updates when filters are applied, providing a real-time geographic view of conversation distribution.

### Country/Region Breakdown

The pie chart shows the top 5 countries by conversation volume, with the remaining countries grouped as "Other." This visualization helps identify which countries are dominating the conversation.

### Metric Analysis

The dashboard provides multiple metrics for each country:
- **Volume**: Total number of conversations
- **Political Bias**: A score indicating political leaning (-1 to 1)
- **Sentiment**: A score indicating positive or negative sentiment

## Filter System

### Time Range Filter

The time range filter allows users to analyze data from different time periods:
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days
- Custom date range

When a time range is selected, all visualizations update automatically to reflect data from that period.

### Other Available Filters

- **Date Filter**: Filter by date
- **Topic Filter**: Filter by conversation topics or keywords
- **Source Filter**: Filter by source type (social media, news, blogs, etc.)
- **Sentiment Filter**: Filter by positive, neutral, or negative sentiment
- **Political Bias Filter**: Filter by political leaning

## How Filters Work

1. **Filter Selection**: When you select a filter option, an API request is triggered
2. **Data Processing**: The backend filters the data accordingly
3. **Visualization Update**: All visualizations (world map, pie chart, metrics) update automatically
4. **Color Consistency**: Colors on the map correspond to the same countries in the pie chart

## Data Insights

The dashboard helps answer key questions such as:
- Which countries are discussing the selected topics most frequently?
- How does sentiment differ by region?
- Are there geographic patterns in political bias?
- How are conversations changing over time?

## Sample Use Cases

1. **Brand Monitoring**: Track where your brand is being discussed globally
2. **Crisis Management**: Monitor sentiment changes during a PR crisis
3. **Campaign Analysis**: Evaluate regional impact of marketing campaigns
4. **Competition Research**: Compare regional conversation share with competitors
5. **Trend Identification**: Spot emerging geographic markets with increasing conversation volume
