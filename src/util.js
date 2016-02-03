export function append(x, a) {
    const l = a.length;
    const b = new Array(l + 1);
    for (let i = 0; i < l; ++i) {
        b[i] = a[i];
    }

    b[l] = x;
    return b;
}

function unsafeRemove(index, a, l) {
    const b = new Array(l);
    let i;
    for (i = 0; i < index; ++i) {
        b[i] = a[i];
    }
    for (i = index; i < l; ++i) {
        b[i] = a[i + 1];
    }

    return b;
}

export function remove(index, array) {
    const l = array.length;
    if (l === 0 || index >= array) { // exit early if index beyond end of array
        return array;
    }

    if (l === 1) { // exit early if index in bounds and length === 1
        return [];
    }

    return unsafeRemove(index, array, l - 1);
}

export function findIndex(x, a) {
    let i = 0;
    let l = a.length;
    for (; i < l; ++i) {
        if (x === a[i]) {
            return i;
        }
    }
    return -1;
}
