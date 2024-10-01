import { useEffect, useState } from "react";
import ExpensesOutput from "../components/expensesOutputs/ExpensesOutput";
import { useExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";

function RecentExpenses() {
	const { expenses, setExpenses } = useExpensesContext();
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState(null);

	const recentExpenses = expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);

		return expense.date >= date7DaysAgo && expense.date <= today;
	});

	function errorHandler() {
		setError(null);
	}

	useEffect(() => {
		async function getExpenses() {
			setIsFetching(true);
			try {
				const expenses = await fetchExpenses();
				setExpenses(expenses);
			} catch (error) {
				setError("Could not fetch expenses");
			} finally {
				setIsFetching(false);
			}
		}
		getExpenses();
	}, []);

	if (isFetching) {
		return <LoadingOverlay />;
	}

	if (error && !isFetching) {
		return <ErrorOverlay message={error} onConfirm={errorHandler} />;
	}

	return (
		<ExpensesOutput
			fallbackText="No expenses register for the last 7 days"
			expenses={recentExpenses}
			expensesPeriod={"Last 7 Days"}
		/>
	);
}

export default RecentExpenses;
