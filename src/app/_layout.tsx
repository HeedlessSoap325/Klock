import { Stack } from 'expo-router';
import { AlarmProvider } from '../context/AlarmContext';
import { RingtoneProvider } from '../context/RingtoneContext';

export default function RootLayout() {
	return (
		<AlarmProvider>
		<RingtoneProvider>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: '#141a2d',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen
					name="index"
					options={{
						title: "Alarms",
					}}
				/>

				<Stack.Screen
					name="add"
					options={{
						title: "Add alarm / group",
						presentation: "modal",
					}}
				/>

				<Stack.Screen
					name="editAlarm"
					options={{
						title: "Edit alarm",
						presentation: "modal",
					}}
				/>

				<Stack.Screen
					name="editAlarmGroup"
					options={{
						title: "Edit alarm group",
						presentation: "modal",
					}}
				/>
			</Stack>
		</RingtoneProvider>
		</AlarmProvider>
	);
}