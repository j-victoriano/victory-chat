export const getSender = (loggedUser, users) => {
    if (users && users.length >= 2 && loggedUser && loggedUser._id) {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    } else {
        // Handle the case where users or loggedUser is undefined, or the data structure is not as expected.
        return 'Sender Not Found';
    }
}

export const getSenderFull = (loggedUser, users) => {
    if (users && users.length >= 2 && loggedUser && loggedUser._id) {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    } else {
        // Handle the case where users or loggedUser is undefined, or the data structure is not as expected.
        return 'Sender Not Found';
    }
}


