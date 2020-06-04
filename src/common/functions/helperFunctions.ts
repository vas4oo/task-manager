import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export function getErrorMessage(error) {
    if (error.message) {
        return { message: `${error.message}` };
    }
    if (error.response) {
        if (
            error.response.data &&
            error.response.data.Data &&
            error.response.data.Data.ErrorCode
        ) {
            return { message: `${error.response.data.Data.ErrorCode}` };
        }

        if (
            error.response.data &&
            error.response.data.Data &&
            error.response.data.Data.Message
        ) {
            return { message: `${error.response.data.Data.Message}` };
        }

        if (error.response.data) {
            return { message: `${error.response.data}` };
        }

        return { message: `${error.response.status} ${error.response.statusText}` };
    } else {
        return { message: `${error.message}` };
    }
}

export function enumToDropdownArray(enumName) {
    let enumAsArray: Array<{ value: number; label: string }> = [];
    for (var n in enumName) {
        if (typeof enumName[n] === "number") {
            enumAsArray.push({
                value: +enumName[n],
                label: n
            });
        }
    }
    return enumAsArray;
}

export function getEnumLabel(
    id: number,
    enumName: any
) {
    let enumElement = Object.keys(enumName).find(key => enumName[key] === id);

    return enumElement;
}

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: 'black',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);