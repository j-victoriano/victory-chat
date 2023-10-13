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

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    )
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}
