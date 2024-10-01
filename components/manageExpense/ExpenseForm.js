import { View, StyleSheet, Text, Alert } from "react-native";
import Input from "./Input";
import { useState } from "react";
import Button from "../ui/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

export default function ExpenseForm({
	onCancel,
	onSubmit,
	submitButtonLabel,
	defaultValue,
}) {
	const [inputs, setInputs] = useState({
		amount: {
			value: defaultValue ? defaultValue?.amount.toString() : "",
			isValid: true,
		},
		date: {
			value: defaultValue ? getFormattedDate(defaultValue?.date) : "",
			isValid: true,
		},
		description: {
			value: defaultValue ? defaultValue?.description : "",
			isValid: true,
		},
	});

	function inputChangeHandler(inputIdentifier, enteredValue) {
		setInputs((curInputs) => {
			return {
				...curInputs,
				[inputIdentifier]: { value: enteredValue, isValid: true },
			};
		});
	}

	function submitHandler() {
		const expenseData = {
			amount: +inputs.amount.value,
			date: new Date(inputs.date.value),
			description: inputs.description.value,
		};

		const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
		const dateIsValid = expenseData.date.toString() !== "Invalid Date";
		const descriptionIsValid = expenseData.description.trim().length > 0;

		if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
			setInputs((curInputs) => {
				return {
					amount: { value: curInputs.amount.value, isValid: amountIsValid },
					date: { value: curInputs.date.value, isValid: dateIsValid },
					description: {
						value: curInputs.description.value,
						isValid: descriptionIsValid,
					},
				};
			});
			return;
		}
		onSubmit(expenseData);
	}

	const formIsInvalid = Object.values(inputs).some((input) => !input.isValid);

	return (
		<View style={styles.form}>
			<Text style={styles.title}>Your expense</Text>
			<View style={styles.inputRow}>
				<Input
					style={styles.rowInput}
					label="Amount"
					inValid={!inputs.amount.isValid}
					textInputConfig={{
						keyboardType: "decimal-pad",
						placeholder: "Enter Amount",
						value: inputs.amount.value,
						onChangeText: inputChangeHandler.bind(this, "amount"),
					}}
				/>
				<Input
					style={styles.rowInput}
					label="Date"
					inValid={!inputs.date.isValid}
					textInputConfig={{
						placeholder: "YYYY-MM-DD",
						maxLength: 10,
						value: inputs.date.value,
						onChangeText: inputChangeHandler.bind(this, "date"),
					}}
				/>
			</View>
			<Input
				label="Description"
				inValid={!inputs.description.isValid}
				textInputConfig={{
					placeholder: "Enter Description",
					multiline: true,
					value: inputs.description.value,
					onChangeText: inputChangeHandler.bind(this, "description"),
				}}
			/>
			{formIsInvalid && (
				<View style={styles.errorTextContainer}>
					<Text style={styles.errorText}>
						Invalid inout values - please check your entered data!
					</Text>
				</View>
			)}
			<View style={styles.buttons}>
				<Button style={styles.button} mode="flat" onPress={onCancel}>
					cancel
				</Button>
				<Button style={styles.button} onPress={submitHandler}>
					{submitButtonLabel}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	form: {
		marginTop: 40,
	},

	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
		marginVertical: 24,
		textAlign: "center",
	},

	inputRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	rowInput: {
		flex: 1,
	},

	errorTextContainer: {
		backgroundColor: GlobalStyles.colors.error50,
		padding: 8,
		marginVertical: 20,
	},

	errorText: {
		textAlign: "center",
		color: GlobalStyles.colors.error500,
	},

	buttons: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	button: {
		minWidth: 120,
		marginHorizontal: 8,
	},
});
