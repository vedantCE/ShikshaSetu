// components/LiveClock.tsx
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

const LiveClock = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Day of the week (e.g., Monday)
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Time in 12-hour format with seconds and AM/PM (e.g., 9:00:05 AM)
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        // second: '2-digit',  // Remove this line if you don't want seconds
      });

      setCurrentDateTime(`${day} • ${time}`);
    };

    updateDateTime(); // Initial call

    // Update every second for live ticking
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval); // Cleanup
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
    fontSize: 14,
    color: '#6c2bee',
    marginBottom: 6,
  },
});

export default LiveClock;