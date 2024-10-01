import { useEffect, useState } from "react";
import ExpensesOutput from "../components/expensesOutputs/ExpensesOutput";
import { useExpensesContext } from "../store/expenses-context";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";

function AllExpenses() {
	const { expenses, setExpenses } = useExpensesContext();
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState(null);

	function errorHandler() {
		setError(null);
	}

	useEffect(() => {
		async function getExpenses() {
			setIsFetching(false);
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
			fallbackText="No expenses found"
			expenses={expenses}
			expensesPeriod="Total"
		/>
	);
}

export default AllExpenses;
