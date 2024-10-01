import axios from "axios";

const BACKEND_URL = "https://rncoursetracking-default-rtdb.firebaseio.com";

export async function storeExpense(expenseData) {
	try {
		const { data } = await axios.post(
			`${BACKEND_URL}/expenses.json`,
			expenseData
		);
		const id = data.name;
		return id;
	} catch (error) {
		throw new Error(error);
	}
}

export async function fetchExpenses() {
	try {
		const { data } = await axios.get(`${BACKEND_URL}/expenses.json`);

		const expenses = [];

		for (const key in data) {
			const expenseObj = {
				id: key,
				amount: data[key].amount,
				date: new Date(data[key].date),
				description: data[key].description,
			};

			expenses.push(expenseObj);
		}

		return expenses;
	} catch (error) {
		throw new Error(error);
	}
}

export function updateExpense(id, expenseData) {
	try {
		return axios.put(`${BACKEND_URL}/expenses/${id}.json`, expenseData);
	} catch (error) {
		throw new Error(error);
	}
}

export function deleteExpense(id) {
	try {
		return axios.delete(`${BACKEND_URL}/expenses/${id}.json`);
	} catch (error) {
		throw new Error(error);
	}
}
