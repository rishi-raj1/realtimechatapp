export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};


export const isSameSender = (messages, m, ind, userId) => {
    return (
        ind < messages.length - 1 &&
        (messages[ind + 1].sender._id !== m.sender._id ||
            messages[ind + 1].sender._id === undefined) &&
        messages[ind].sender._id !== userId
    );
};


export const isLastMessage = (messages, ind, userId) => {
    return (
        ind === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
};


export const isSameSenderMargin = (messages, m, ind, userId) => {
    if (
        ind < messages.length - 1 &&
        messages[ind + 1].sender._id === m.sender._id &&
        messages[ind].sender._id !== userId
    ) {
        return 33;
    }
    else if (
        (ind < messages.length - 1 &&
            messages[ind + 1].sender._id !== m.sender._id &&
            messages[ind].sender._id !== userId) ||
        (ind === messages.length - 1 && messages[ind].sender._id !== userId)
    ) {
        return 0;
    }
    else return 'auto';
};

export const isSameUser = (messages, m, ind) => {
    return ind > 0 && messages[ind - 1].sender._id === m.sender._id;
}