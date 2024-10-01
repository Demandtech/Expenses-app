import { Text, Pressable, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";
import { useNavigation } from "@react-navigation/native";

export default function ExpensesItem({ description, amount, date, id }) {
	const navigation = useNavigation();

	function expensesPressHandler() {
		navigation.navigate("ManageExpense", {
			expenseId: id,
		});
	}

	return (
		<Pressable
			style={({ pressed }) => pressed && styles.pressed}
			onPress={expensesPressHandler}
		>
			<View style={styles.expenseItem}>
				<View style={styles.description}>
					<Text style={styles.textBase}>{description}</Text>
					<Text style={styles.textBase}>{getFormattedDate(date)}</Text>
				</View>
				<View style={styles.amountContainer}>
					<Text style={styles.amount}>{amount.toFixed(2)}</Text>
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	expenseItem: {
		padding: 12,
		marginVertical: 8,
		backgroundColor: GlobalStyles.colors.primary500,
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 6,
		elevation: 3,
		shadowColor: GlobalStyles.colors.gray500,
		shadowRadius: 4,
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.4,
	},

	textBase: {
		color: GlobalStyles.colors.primary50,
	},

	description: {
		fontSize: 16,
		marginBottom: "bold ",
	},

	amountContainer: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 4,
		minWidth: 80,
	},
	amount: {
		color: GlobalStyles.colors.primary500,
		fontWeight: "bold",
	},
	pressed: {
		opacity: 0.75,
	},
});
