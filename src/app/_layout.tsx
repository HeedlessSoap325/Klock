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
			</Stack>
		</AlarmProvider>
	);
}