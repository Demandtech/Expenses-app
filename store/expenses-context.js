import { createContext, useContext, useReducer } from "react";

const ExpensesContext = createContext({
	expenses: [],
	addExpense: ({ description, amount, date }) => {},
	setExpenses: (expenses) => {},
	deleteExpense: (id) => {},
	updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
	switch (action.type) {
		case "ADD":
			return {
				...state,
				expenses: [action.payload, ...state.expenses],
			};
		case "SET":
			const inverted = action.payload.reverse();
			return {
				...state,
				expenses: inverted,
			};
		case "UPDATE":
			const updatableExpenseIndex = state.expenses.findIndex(
				(expense) => expense.id === action.payload.id
			);
			const updatableExpense = state.expenses[updatableExpenseIndex];
			const updatedItem = { ...updatableExpense, ...action.payload.data };
			const updatedExpenses = [...state.expenses];

			updatedExpenses[updatableExpenseIndex] = updatedItem;

			return { ...state, expenses: updatedExpenses };
		case "DELETE":
			const newExpenses = state.expenses.filter(
				(expense) => expense.id !== action.payload
			);
			return { ...state, expenses: newExpenses };
		default:
			return state;
	}
}

export default function ExpenseContextProvider({ children }) {
	const [initialState, dispatch] = useReducer(expensesReducer, {
		expenses: [],
	});

	function addExpense(expenseData) {
		dispatch({ type: "ADD", payload: expenseData });
	}

	function setExpenses(expenses) {
		dispatch({ type: "SET", payload: expenses });
	}

	function deleteExpense(id) {
		dispatch({ type: "DELETE", payload: id });
	}

	function updateExpense(id, expenseData) {
		dispatch({ type: "UPDATE", payload: { id, data: expenseData } });
	}

	const value = {
		addExpense,
		setExpenses,
		deleteExpense,
		updateExpense,
		expenses: initialState.expenses,
	};

	return (
		<ExpensesContext.Provider value={value}>
			{children}
		</ExpensesContext.Provider>
	);
}

export function useExpensesContext() {
	return useContext(ExpensesContext);
}
