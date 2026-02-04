// components/LiveClock.tsx
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

const LiveClock = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Day of the week (e.g., MONDAY)
      const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      
      // Month and date (e.g., OCTOBER 24)
      const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
      const date = now.getDate();
      
      // Time in 12-hour format with AM/PM (e.g., 9:00 AM)
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      setCurrentDateTime(`${day}, ${month} ${date} • ${time}`);
    };

    updateDateTime(); // Initial call

    // Update every second for live ticking
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{currentDateTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C4DFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default LiveClock;