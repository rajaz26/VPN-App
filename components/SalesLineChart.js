import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {TouchableOpacity} from 'react-native';
import {COLORS} from '../assets/theme/index';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const xLabelFunc = {
  marginTop: 1,
};

const salesData = [1500, 5000, 2200, 3200, 2800, 3800, 5000];
const monthLabels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const SalesLineChart = () => {
  const cardHeight = windowHeight * 0.25; // 25% of window height
  const cardWidth = windowWidth * 0.9; // 90% of window width
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  const onDataPointClick = ({value}) => {
    const dataIndex = salesData.indexOf(value);
    if (dataIndex !== -1) {
      setSelectedPoint(value);
      setSelectedMonth(monthLabels[dataIndex]);
      setPopupVisible(true);

      setTimeout(() => {
        setPopupVisible(false);
      }, 2000);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={[styles.chartCard, {height: cardHeight}, {width: cardWidth}]}>
        <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Monthly Sales</Text>
        </View>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              datasets: [{data: salesData}],
            }}
            fromZero={true}
            yAxisLabel=" $ "
            width={cardWidth - 15}
            height={cardHeight - 30} // Subtracting 40 for the chart title's height
            chartConfig={{
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              backgroundColor: COLORS.primary,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '2',
                stroke: COLORS.secondary,
              },
            }}
            onDataPointClick={onDataPointClick}
            bezier={true}
          />
          {popupVisible && (
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>
                Month: {selectedMonth} | Sales: ${selectedPoint}
              </Text>
            </View>
          )}
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
    // elevation: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.05,
    padding: 10,
  },
  chartTitleContainer: {
    alignItems: 'center',
    marginTop: -6,
    marginBottom: 2,
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily:'Poppins-Regular',
    marginBottom:10,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  popupContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 10,
    bottom: 10,
    right: 10,
  },
  popupText: {
    color: 'white',
    fontSize: 14,
  },
});

export default SalesLineChart;