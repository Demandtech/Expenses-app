import { StyleSheet, Text, View } from "react-native";

import { GlobalStyles } from "../../constants/styles";
import ExpensesSummary from "./ExpensesSummary";
import ExpensesList from "./ExpensesList";

export default function ExpensesOutput({
	expenses,
	expensesPeriod,
	fallbackText,
}) {

	let content = <Text style={styles.infoText}>{fallbackText}</Text>;

	if (expenses.length > 0) {
		content = <ExpensesList expenses={expenses} />;
	}

	return (
		<View style={styles.container}>
			<ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
			{content}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
		backgroundColor: GlobalStyles.colors.primary700,
	},
	infoText: {
		color: "white",
		fontSize: 16,
		textAlign: "center",
	},
});
