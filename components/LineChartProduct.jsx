import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SelectList } from 'react-native-dropdown-select-list'; // Import SelectList
import { COLORS } from '../assets/theme/index';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const products = [
  'Product A',
  'Product B',
  'Product C',
  'Product D',
  'Product E',
]; // Add more product names
const productSalesData = {
  'Product A': [1500, 5000, 2200, 3200, 2800],
  'Product B': [3000, 4000, 1500, 4500, 3500],
  'Product C': [1000, 2000, 2500, 1800, 3000],
  'Product D': [2000, 3000, 2800, 3200, 4000],
  'Product E': [3500, 2500, 3000, 2000, 2800],
}; // Add more sales data for each product

const LineChartProduct = () => {
  const cardHeight = windowHeight * 0.35;
  const cardWidth = windowWidth * 0.9;

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  const onDataPointClick = ({ value }) => {
    const dayIndex = productSalesData[selectedProduct].indexOf(value);
    if (dayIndex !== -1) {
      setSelectedPoint(value);
      setSelectedDay(`Day ${dayIndex + 1}`);
      setPopupVisible(true);

      setTimeout(() => {
        setPopupVisible(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.chartCard,
          { height: cardHeight * 1.3 },
          { width: cardWidth },
        ]}>
        <View style={styles.chartTitleContainer}>
          <Text style={styles.chartTitle}>Products Sales Graph</Text>
        </View>
        <View style={styles.chartContainer}>
          <SelectList // Use the SelectList component
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            data={products.map((product) => ({ key: product, value: product }))}
            fontFamily="lato"
            arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />}
            searchicon={<FontAwesome name="search" size={12} color={'black'} />}
            search={false}
            boxStyles={{ borderRadius: 0 }}
            defaultOption={{ key: products[0], value: products[0] }}
          />
          <LineChart
            data={{
              labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
              datasets: [{ data: productSalesData[selectedProduct] }],
            }}
            fromZero={true}
            yAxisLabel=" $ "
            width={cardWidth - 15}
            height={cardHeight - 30} // Subtracting 30 for the chart title's height
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
                {selectedDay} | Sales: ${selectedPoint}
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
    elevation: 4,
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
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  picker: {
    backgroundColor: COLORS.primary,
    color: 'white',
    borderRadius: 4,
    marginBottom: 10,
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

export default LineChartProduct;
