// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// import { useAuth } from '../context/AuthContext';
// import { Image } from 'react-native-svg';

// const disorders = ['ASD', 'ADHD', 'Intellectual Disability', 'None'];

// export const AddStudentScreen = ({ navigation }: any) => {
//   const { user, students, addStudent, updateParentInfo, selectStudent } = useAuth();
//   const isFirst = user?.role === 'parent' && students.length === 0;

//   const [childName, setChildName] = useState('');
//   const [age, setAge] = useState('');
//   const [disorder, setDisorder] = useState<string | null>(null);
//   const [giveQuiz, setGiveQuiz] = useState<'yes' | 'no'>('yes');
//   const [parentName, setParentName] = useState(user?.name || '');
//   const [parentEmail, setParentEmail] = useState(user?.email || '');

//   const handleSave = () => {
//     if (!childName || !disorder) {
//       Alert.alert('Please fill required fields');
//       return;
//     }
//     if (isFirst && (!parentName || !parentEmail)) {
//       Alert.alert('Please enter parent details (first time setup)');
//       return;
//     }

//     if (isFirst) updateParentInfo(parentName, parentEmail);

//     const newId = Date.now().toString();
//     addStudent({
//       id: newId,
//       name: childName,
//       age: age ? Number(age) : undefined,
//       disorder,
//       // avatar:Image,
//     });

//     Alert.alert('Child Added Successfully!');

//     if (giveQuiz === 'yes') {
//       navigation.navigate('Quiz', { newStudentId: newId });
//     } else {
//       selectStudent(newId);
//       navigation.replace('ActivityHub');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Add New Child/Student</Text>

//       {isFirst && (
//         <>
//           <Text style={styles.section}>Parent Details (One-time Setup)</Text>
//           <TextInput placeholder="Parent Name" value={parentName} onChangeText={setParentName} style={styles.input} />
//           <TextInput placeholder="Parent Email" value={parentEmail} onChangeText={setParentEmail} style={styles.input} keyboardType="email-address" />
//         </>
//       )}

//       <Text style={styles.section}>Child Details</Text>
//       <TextInput placeholder="Child Name *" value={childName} onChangeText={setChildName} style={styles.input} />
//       <TextInput placeholder="Age (optional)" value={age} onChangeText={setAge} style={styles.input} keyboardType="numeric" />

//       <Text style={styles.label}>Primary Focus Area *</Text>
//       <View style={styles.options}>
//         {disorders.map(d => (
//           <TouchableOpacity key={d} style={[styles.option, disorder === d && styles.selected]} onPress={() => setDisorder(d)}>
//             <Text style={disorder === d ? styles.selectedText : {}}>{d}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.label}>Give Initial Assessment Quiz?</Text>
//       <View style={styles.radio}>
//         <TouchableOpacity style={[styles.radioBtn, giveQuiz === 'yes' && styles.selected]} onPress={() => setGiveQuiz('yes')}>
//           <Text>Yes</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.radioBtn, giveQuiz === 'no' && styles.selected]} onPress={() => setGiveQuiz('no')}>
//           <Text>No</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.save} onPress={handleSave}>
//         <Text style={styles.saveText}>Save & Continue</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#4A90E2' },
//   section: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
//   input: { backgroundColor: '#F0F8FF', padding: 15, borderRadius: 8, marginBottom: 15 },
//   label: { fontSize: 16, marginVertical: 10 },
//   options: { flexDirection: 'row', flexWrap: 'wrap' },
//   option: { backgroundColor: '#EEE', padding: 12, borderRadius: 8, margin: 5 },
//   selected: { backgroundColor: '#4A90E2' },
//   selectedText: { color: '#FFF' },
//   radio: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
//   radioBtn: { backgroundColor: '#EEE', padding: 15, borderRadius: 8, width: 100, alignItems: 'center' },
//   save: { backgroundColor: '#4A90E2', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
//   saveText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const disorders = ['ASD', 'ADHD', 'Intellectual Disability', 'None'];

export const AddStudentScreen = ({ navigation }: any) => {
  const { user, students, addStudent, updateParentInfo, selectStudent } =
    useAuth();
  const isFirst = user?.role === 'parent' && students.length === 0;

  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [disorder, setDisorder] = useState<string | null>(null);
  const [giveQuiz, setGiveQuiz] = useState<'yes' | 'no'>('yes');
  const [parentName, setParentName] = useState(user?.name || '');
  const [parentEmail, setParentEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (!childName || !disorder) {
      Alert.alert('Please fill required fields');
      return;
    }

    if (isFirst && (!parentName || !parentEmail)) {
      Alert.alert('Please enter parent details (first time setup)');
      return;
    }

    if (isFirst) updateParentInfo(parentName, parentEmail);

    const newId = Date.now().toString();

    addStudent({
      id: newId,
      name: childName,
      age: age ? Number(age) : undefined,
      disorder,
    });

    if (giveQuiz === 'yes') {
      navigation.navigate('Quiz', { newStudentId: newId });
    } else {
      selectStudent(newId);
      navigation.replace('ActivityHub');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Add New Child/Student</Text>

          {isFirst && (
            <>
              <Text style={styles.section}>
                Parent Details (One-time Setup)
              </Text>
              <TextInput
                placeholder="Parent Name"
                placeholderTextColor={'gray'}
                value={parentName}
                onChangeText={setParentName}
                style={styles.input}
              />
              <TextInput
                placeholder="Parent Email"
                placeholderTextColor={'gray'}
                value={parentEmail}
                onChangeText={setParentEmail}
                style={styles.input}
                keyboardType="email-address"
              />
            </>
          )}

          <Text style={styles.section}>Child Details</Text>
          <TextInput
            placeholder="Child Name *"
            placeholderTextColor={'gray'}
            value={childName}
            onChangeText={setChildName}
            style={styles.input}
          />
          <TextInput
            placeholder="Age (optional)"
            placeholderTextColor={'gray'}
            value={age}
            onChangeText={setAge}
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Primary Focus Area *</Text>
          <View style={styles.options}>
            {disorders.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.option, disorder === d && styles.selected]}
                onPress={() => setDisorder(d)}
              >
                <Text style={disorder === d ? styles.selectedText : undefined}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Give Initial Assessment Quiz?</Text>
          <View style={styles.radio}>
            <TouchableOpacity
              style={[styles.radioBtn, giveQuiz === 'yes' && styles.selected]}
              onPress={() => setGiveQuiz('yes')}
            >
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioBtn, giveQuiz === 'no' && styles.selected]}
              onPress={() => setGiveQuiz('no')}
            >
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* FIXED FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Text style={styles.saveText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A90E2',
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: { fontSize: 16, marginVertical: 10 },
  options: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { backgroundColor: '#EEE', padding: 12, borderRadius: 8, margin: 5 },
  selected: { backgroundColor: '#4A90E2' },
  selectedText: { color: '#FFF' },
  radio: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  radioBtn: {
    backgroundColor: '#EEE',
    padding: 15,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },

  save: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
