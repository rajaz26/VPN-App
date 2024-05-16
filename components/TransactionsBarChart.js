import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {COLORS} from '../assets/theme/index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const transactionData = [10, 20, 15, 30, 25]; // Example transaction data for the last 5 hours

const TransactionsBarChart = () => {
  const cardHeight = windowHeight * 0.25; // 25% of window height
  const cardWidth = windowWidth * 0.9; // 90% of window width

  const getTimeLabel = hour => {
    const amPm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${amPm}`;
  };

  const labels = [];
  const currentHour = new Date().getHours(); // Get current hour
  for (let i = currentHour - 5; i < currentHour; i++) {
    const hour = i < 0 ? 24 + i : i; // Handle wrapping around to previous day
    labels.push(getTimeLabel(hour));
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.chartCard, {height: cardHeight}, {width: cardWidth}]}>
        <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Transactions in Last 5 Hours</Text>
        </View>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: transactionData,
                  colors: [
                    (opacity = 1) => `#FF5733`,
                    (opacity = 1) => `#C70039`,
                    (opacity = 1) => `#900C3F`,
                    (opacity = 1) => `#581845`,
                    (opacity = 1) => `#2E86C1`,
                    (opacity = 1) => `#1E8449`,
                  ],
                },
              ],
            }}
            showBarTops={false}
            width={cardWidth - 20}
            showValuesOnTopOfBars={true}
            fromZero={true}
            withInnerLines={false}
            height={cardHeight - 30}
            withCustomBarColorFromData={true}
            flatColor={true}
            chartConfig={{
              backgroundGradientFrom: COLORS.barchart,
              backgroundGradientTo: COLORS.barchart,
              backgroundColor: COLORS.barchart,
              decimalPlaces: 0,
              color: (opacity = 1) => COLORS.primary,
              labelColor: (opacity = 1) => COLORS.primary,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: COLORS.barchart,
              },
            }}
            bezier={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chartCard: {
    elevation: 4,
    backgroundColor: COLORS.barchart,
    borderRadius: 8,
    marginTop: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.05,
    padding: 0, // Remove left padding
  },
  chartTitleContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  chartTitle: {
    color: COLORS.primary, // Change text heading color to black
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TransactionsBarChart;