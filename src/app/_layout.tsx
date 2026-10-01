import { Stack } from 'expo-router';
import { AlarmProvider } from '../context/AlarmContext';

export default function RootLayout() {
	return (
		<AlarmProvider>
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
				<Stack.Screen
					name="index"
					options={{
						title: "Alarms",
					}}
				/>

				<Stack.Screen
					name="addAlarm"
					options={{
						title: "Add alarm",
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
			</Stack>
		</AlarmProvider>
	);
}