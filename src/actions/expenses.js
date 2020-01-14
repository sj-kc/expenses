import database from "../firebase/firebase";


export const addExpense = expense => {
    return {
        type: "ADD_EXPENSE",
        expense
    };
};

export const startAddExpense = (expenseData = {}) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;

        const {
            description = "",
            note = "",
            amount = 0,
            createdAt = 0
        } = expenseData;

        const expense = {
            description,
            note,
            amount,
            createdAt
        };

        return database
            .ref(`users/${uid}/expenses`)
            .push(expense)
            .then(snapshot => {
                dispatch(
                    addExpense({
                        id: snapshot.key,
                        ...expense
                    })
                );
            });
    };
};


export const removeExpense = ({ id } = {}) => {
    return {
        type: "REMOVE_EXPENSE",
        id
    };
};

export const startRemoveExpense = ({ id } = {}) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        return database
            .ref(`users/${uid}/expenses/${id}`)
            .remove()
            .then(() => {
                return dispatch(removeExpense({ id }));
            });
    };
};

// EDIT_EXPENSE

export const editExpense = (id, updates) => {
    return {
        type: "EDIT_EXPENSE",
        id,
        updates
    };
};

export const startEditExpense = (id, updates) => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        return database
            .ref(`users/${uid}/expenses/${id}`)
            .set(updates)
            .then(() => {
                dispatch(editExpense(id, updates));
            });
    };
};



export const setExpenses = expenses => {
    return {
        type: "SET_EXPENSES",
        expenses
    };
};

export const startSetExpenses = () => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        return database
            .ref(`users/${uid}/expenses`)
            .once("value")
            .then(snapshot => {
                const expenses = [];

                snapshot.forEach(childSnapshot => {
                    expenses.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });

                dispatch(setExpenses(expenses));
            });
    };
};