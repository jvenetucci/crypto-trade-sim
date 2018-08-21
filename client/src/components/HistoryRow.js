import React from 'react';
import {Table} from 'semantic-ui-react'
import moment from 'moment'

const HoldingsRow = (props) => {
    return (
        <Table.Row>
            <Table.Cell>{moment(props.history.date).format('YYYY-MM-DD HH:mm')}</Table.Cell>
            <Table.Cell>{props.history.type}</Table.Cell>
            <Table.Cell>{props.history.toCurrency}</Table.Cell>
            <Table.Cell>{props.history.fromCurrency}</Table.Cell>
            <Table.Cell textAlign='right'>{props.history.quantity}</Table.Cell>
            <Table.Cell textAlign='right'>{props.history.price}</Table.Cell>
        </Table.Row>
    );
};


export default HoldingsRow;