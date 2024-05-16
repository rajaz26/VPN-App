import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {COLORS} from '../assets/theme';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = [
  {
    name: 'Shamboo',
    population: 2150,
    color: '#2085ec',
    legendFontColor: '#FFFFF4',
  },
  {
    name: 'Lotion',
    population: 2800,
    color: '#0a417a',
    legendFontColor: '#FFFFF4',
  },
  {
    name: 'Oil',
    population: 5270,
    color: '#cea9bc',
    legendFontColor: '#FFFFF4',
  },
  {
    name: 'Hair Brush',
    population: 1500,
    color: '#fb7b8b',
    legendFontColor: '#FFFFF4',
  },
  {
    name: 'Tooth Paste',
    population: 4500,
    color: '#9467bd',
    legendFontColor: '#FFFFF4',
  },
];

const ChartScreen = () => {
  const cardHeight = windowHeight * 0.25; // 25% of window height
  const cardWidth = windowWidth * 0.9; // 90% of window width

  return (
    <View style={styles.container}>
      <View style={[styles.chartCard, {height: cardHeight, width: cardWidth}]}>
        <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Top Five Selling Products</Text>
        </View>
        <PieChart
          data={data}
          hasLegend={true}
          width={cardWidth}
          height={cardHeight}
          chartConfig={{
            // color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            // labelColor: (opacity = 0.7) => `rgba(255, 255, 255, ${opacity})`, // Change label text color to dull white
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false, // optional
          }}
          accessor="population"
          backgroundColor="transparent"
        />
      </View>
      {/* Add other components below the chart */}
      <View style={styles.bottomContent}>{/* Other components go here */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Align chart to the top of the screen
  },
  chartCard: {
    elevation: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.05,
    padding: 10,
  },
  chartTitleContainer: {
    alignItems: 'center',
    marginBottom: -windowHeight * 0.02, // Adjusted margin
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomContent: {
    flex: 1, // Take remaining space
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20, // Add space between chart and other components
  },
});

export default ChartScreen;