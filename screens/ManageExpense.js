import { useLayoutEffect, useState } from "react";
import { GlobalStyles } from "../constants/styles";
import { StyleSheet, View } from "react-native";
import IconButton from "../components/ui/IconButton";
import { useExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/manageExpense/ExpenseForm";
import * as HttpRequest from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";

export default function ManageExpense({ route, navigation }) {
	const expenseIdParams = route.params?.expenseId;
	const isEditing = !!expenseIdParams;
	const expensesCtx = useExpensesContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const selectedExpense = expensesCtx.expenses.find(
		(expense) => expense.id === expenseIdParams
	);

	async function deleteExpenseHandler() {
		setIsSubmitting(true);
		try {
			expensesCtx.deleteExpense(expenseIdParams);
			await HttpRequest.deleteExpense(expenseIdParams);
			navigation.goBack();
		} catch (error) {
			setError("Error occured deleting expense");
		} finally {
			setIsSubmitting(false);
		}
	}

	function cancelHandler() {
		navigation.goBack();
	}

	async function confirmHandler(expenseData) {
		setIsSubmitting(true);
		try {
			if (isEditing) {
				expensesCtx.updateExpense(expenseIdParams, expenseData);
				await HttpRequest.updateExpense(expenseIdParams, expenseData);
			} else {
				const id = await HttpRequest.storeExpense(expenseData);
				expensesCtx.addExpense({ ...expenseData, id });
			}
			navigation.goBack();
		} catch (error) {
			setError("Could not save data - please try again later!");
		} finally {
			setIsSubmitting(false);
		}
	}

	function errorHandler() {
		setError(null);
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? "Edit Expense" : "Add Expense",
		});
	}, [isEditing, navigation]);

	if (isSubmitting) {
		return <LoadingOverlay />;
	}

	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} onConfirm={errorHandler} />;
	}

	return (
		<View style={styles.container}>
			<ExpenseForm
				onCancel={cancelHandler}
				submitButtonLabel={isEditing ? "Update" : "Add"}
				onSubmit={confirmHandler}
				defaultValue={selectedExpense}
			/>

			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon="trash"
						color={GlobalStyles.colors.error500}
						size={36}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: GlobalStyles.colors.primary800,
	},

	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: "center",
	},
});
