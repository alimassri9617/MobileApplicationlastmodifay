import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Button, Checkbox, RadioButton, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import useSignup from '../../hooks/useSignup';

const departments = [
  'Computer and Communications Engineering',
  'Technology in Computer Science',
  'Human Resource Management',
  'Economics',
  'Accounting, Control, and Auditing',
  'Banking and Finance',
  'Marketing and Management',
  'Nursing Sciences',
  'Dental Laboratory Technology',
  'Physical Therapy',
  'Communication and Journalism',
  'Audiovisual',
  'Graphic Design and Advertising',
  'Music Therapy',
  'European Art Music',
  'General Musicology of Traditions and Arabic Art Music',
  'Music Education Sciences and Music, Technology, and Media',
  'Motricity Education and Adapted Physical Activities',
  'Sports Training',
  'Sports Management'
];

const SignUp = ({ navigation }) => {
  const [inputs, setInputs] = useState({
    uniId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: '',
    Department: '',
    title: '',
    major: '',
  });

  const [schedule, setSchedule] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState({
    day: 'Monday',
    subject: '',
    startTime: new Date(),
    endTime: new Date(),
    mode: 'campus',
    room: '',
  });

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const { loading, signup } = useSignup();

  const handleScheduleChange = (field, value) => {
    setCurrentSchedule(prev => ({
      ...prev,
      [field]: value,
      room: field === 'mode' && value === 'online' ? 'Microsoft Teams' : prev.room,
    }));
  };

  const addScheduleEntry = () => {
    const formattedEntry = {
      ...currentSchedule,
      startTime: dayjs(currentSchedule.startTime).format('hh:mm A'),
      endTime: dayjs(currentSchedule.endTime).format('hh:mm A')
    };
    setSchedule(prev => [...prev, formattedEntry]);
    setCurrentSchedule({ day: 'Monday', subject: '', startTime: new Date(), endTime: new Date(), mode: 'campus', room: '' });
  };

  const removeScheduleEntry = index => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    await signup({ ...inputs, schedule });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up <Text style={{ color: '#ff2a1b' }}>ChatApp</Text></Text>
      <View style={styles.form}>
        <TextInput placeholder="University ID" style={styles.input} value={inputs.uniId} onChangeText={text => setInputs({ ...inputs, uniId: text })} />
        <TextInput placeholder="First Name" style={styles.input} value={inputs.firstName} onChangeText={text => setInputs({ ...inputs, firstName: text })} />
        <TextInput placeholder="Last Name" style={styles.input} value={inputs.lastName} onChangeText={text => setInputs({ ...inputs, lastName: text })} />
        <TextInput placeholder="Email" keyboardType="email-address" style={styles.input} value={inputs.email} onChangeText={text => setInputs({ ...inputs, email: text })} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={inputs.password} onChangeText={text => setInputs({ ...inputs, password: text })} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} value={inputs.confirmPassword} onChangeText={text => setInputs({ ...inputs, confirmPassword: text })} />

        <Text style={styles.label}>Gender</Text>
        <RadioButton.Group
          onValueChange={(value) => setInputs({ ...inputs, gender: value })}
          value={inputs.gender}
        >
          <View style={styles.genderContainer}>
            <View style={styles.genderItem}>
              <RadioButton value="male" color="#117927" />
              <Text>Male</Text>
            </View>
            <View style={styles.genderItem}>
              <RadioButton value="female" color="#117927" />
              <Text>Female</Text>
            </View>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Role</Text>
        <RadioButton.Group
          onValueChange={(value) => setInputs({ ...inputs, role: value })}
          value={inputs.role}
        >
          <View style={styles.genderContainer}>
            <View style={styles.genderItem}>
              <RadioButton value="student" color="#117927" />
              <Text>Student</Text>
            </View>
            <View style={styles.genderItem}>
              <RadioButton value="teacher" color="#117927" />
              <Text>Teacher</Text>
            </View>
            <View style={styles.genderItem}>
              <RadioButton value="admin" color="#117927" />
              <Text>Admin</Text>
            </View>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Department</Text>
        <FlatList
          data={departments}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setInputs({ ...inputs, Department: item })}>
              <Text style={[styles.input, { color: inputs.Department === item ? '#117927' : '#000' }]}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {(inputs.role === 'teacher' || inputs.role === 'admin') && (
          <TextInput
            placeholder="Title (for teacher/admin)"
            style={styles.input}
            value={inputs.title}
            onChangeText={(text) => setInputs({ ...inputs, title: text })}
          />
        )}

        {inputs.role === 'student' && (
          <TextInput
            placeholder="Major (for students)"
            style={styles.input}
            value={inputs.major}
            onChangeText={(text) => setInputs({ ...inputs, major: text })}
          />
        )}

        {inputs.role === 'student' && (
          <>
            <Text style={styles.sectionTitle}>Schedule Entry (Students Only)</Text>
            <TextInput placeholder="Day" style={styles.input} value={currentSchedule.day} onChangeText={text => handleScheduleChange('day', text)} />
            <TextInput placeholder="Subject" style={styles.input} value={currentSchedule.subject} onChangeText={text => handleScheduleChange('subject', text)} />

            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
              <TextInput
                placeholder="Start Time"
                value={dayjs(currentSchedule.startTime).format('hh:mm A')}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={currentSchedule.startTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowStartTimePicker(false);
                  if (date) handleScheduleChange('startTime', date);
                }}
              />
            )}

            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <TextInput
                placeholder="End Time"
                value={dayjs(currentSchedule.endTime).format('hh:mm A')}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={currentSchedule.endTime}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowEndTimePicker(false);
                  if (date) handleScheduleChange('endTime', date);
                }}
              />
            )}

            <TextInput placeholder="Mode" style={styles.input} value={currentSchedule.mode} onChangeText={text => handleScheduleChange('mode', text)} />
            <TextInput
              placeholder="Room"
              style={styles.input}
              value={currentSchedule.room}
              onChangeText={text => handleScheduleChange('room', text)}
              editable={currentSchedule.mode !== 'online'}
            />

            <Button
              mode="contained"
              onPress={addScheduleEntry}
              style={styles.addBtn}
            >
              Add Schedule Entry
            </Button>

            <FlatList
              data={schedule}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <List.Item
                  title={`${item.day} - ${item.subject}`}
                  description={`Time: ${item.startTime} to ${item.endTime} | Mode: ${item.mode} | Room: ${item.room}`}
                  right={() => (
                    <Button onPress={() => removeScheduleEntry(index)}>Delete</Button>
                  )}
                />
              )}
            />
          </>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={loading}
          style={styles.signupBtn}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.backLink}>BackToDashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: '#117927',
    marginBottom: 20,
  },
  form: {
    gap: 10,
  },
  input: {
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#117927',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#117927'
  },
  addBtn: {
    backgroundColor: '#ff2a1b',
    marginVertical: 10,
  },
  signupBtn: {
    backgroundColor: '#ff2a1b',
    marginVertical: 10,
  },
  backLink: {
    color: '#0f172a',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default SignUp;
